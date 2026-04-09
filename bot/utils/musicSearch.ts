import { Song } from './musicState';

interface SearchResult {
  title: string;
  url: string;
  duration?: number;
  source: 'youtube' | 'spotify' | 'apple-music' | 'direct' | 'search';
}

/**
 * Search for music using multiple sources
 */
export async function searchMusic(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];

  try {
    // YouTube search
    const youtubeResults = await searchYouTube(query);
    results.push(...youtubeResults);

    // Spotify search
    const spotifyResults = await searchSpotify(query);
    results.push(...spotifyResults);
  } catch (error) {
    console.error('Error searching music:', error);
  }

  return results;
}

/**
 * YouTube search using play-dl
 */
async function searchYouTube(query: string): Promise<SearchResult[]> {
  try {
    // Try to use play-dl if available
    try {
      const play = require('play-dl');
      
      if (play && play.search) {
        const results = await play.search(query, { limit: 3 });
        return results.map((video: any) => ({
          title: video.title || query,
          url: video.url || `https://www.youtube.com/watch?v=${video.id}`,
          duration: video.durationInSec,
          source: 'youtube' as const,
        }));
      }
    } catch (e) {
      console.warn('play-dl not fully initialized, using fallback');
    }
    
    // Fallback: return search result page
    return [
      {
        title: `YouTube: ${query}`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        source: 'youtube',
      },
    ];
  } catch (error) {
    console.error('YouTube search error:', error);
    return [];
  }
}

/**
 * Spotify search
 */
async function searchSpotify(query: string): Promise<SearchResult[]> {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return [];
    }

    // Get access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    });

    const tokenData = await tokenResponse.json() as { access_token: string };

    // Search Spotify
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=3`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const searchData = await searchResponse.json() as any;

    if (searchData.tracks?.items) {
      return searchData.tracks.items.map((track: any) => ({
        title: `${track.name} - ${track.artists[0]?.name || 'Unknown'}`,
        url: track.external_urls?.spotify || '',
        duration: Math.floor(track.duration_ms / 1000),
        source: 'spotify' as const,
      }));
    }

    return [];
  } catch (error) {
    console.error('Spotify search error:', error);
    return [];
  }
}

/**
 * Parse different URL formats and extract song info
 */
export async function parseMusicUrl(
  url: string,
  query?: string
): Promise<SearchResult | null> {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return {
        title: query || 'YouTube Song',
        url,
        source: 'youtube',
      };
    }

    // Spotify
    if (hostname.includes('spotify.com')) {
      if (url.includes('track/')) {
        const trackId = url.split('track/')[1]?.split('?')[0];
        if (trackId) {
          return {
            title: query || 'Spotify Track',
            url,
            source: 'spotify',
          };
        }
      }
    }

    // Apple Music
    if (hostname.includes('music.apple.com')) {
      return {
        title: query || 'Apple Music',
        url,
        source: 'apple-music',
      };
    }

    // Direct audio link
    if (url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.flac')) {
      return {
        title: query || 'Direct Audio',
        url,
        source: 'direct',
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Get actual playable URL from various sources
 */
export async function getPlayableUrl(song: Song): Promise<string> {
  try {
    if (song.source === 'direct') {
      return song.url;
    }

    if (song.source === 'youtube') {
      // Using play-dl to get stream URL
      // For production: const stream = await play.stream(song.url);
      // return stream.url;
      return song.url;
    }

    // For Spotify and Apple Music, you might need to search YouTube
    // or use a proxy service to get the actual audio
    return song.url;
  } catch (error) {
    console.error('Error getting playable URL:', error);
    return song.url;
  }
}
