import { createAudioResource, AudioResource, StreamType } from '@discordjs/voice';
import { Readable } from 'stream';

/**
 * Get a stream for a YouTube video
 */
export async function getYouTubeStream(url: string): Promise<Readable | null> {
  try {
    // Try to use play-dl
    try {
      const play = require('play-dl');
      
      if (play && play.stream) {
        const stream = await play.stream(url);
        return stream.stream;
      }
    } catch (e) {
      console.warn('play-dl stream not available');
    }

    // Fallback: return null (bot can't stream this source)
    return null;
  } catch (error) {
    console.error('Error getting YouTube stream:', error);
    return null;
  }
}

/**
 * Get a stream for a Spotify track (converts to YouTube search)
 */
export async function getSpotifyStream(spotifyUrl: string, trackName: string): Promise<Readable | null> {
  try {
    // Spotify requires converting to YouTube search
    // Search for the track on YouTube and play first result
    const play = require('play-dl');
    
    if (play && play.search) {
      const results = await play.search(trackName, { limit: 1 });
      
      if (results.length > 0) {
        const youtubeUrl = results[0].url;
        return getYouTubeStream(youtubeUrl);
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting Spotify stream:', error);
    return null;
  }
}

/**
 * Get a stream for Apple Music (converts to YouTube search)
 */
export async function getAppleMusicStream(appleMusicUrl: string, trackName: string): Promise<Readable | null> {
  try {
    // Apple Music also requires converting to YouTube
    const play = require('play-dl');
    
    if (play && play.search) {
      const results = await play.search(trackName, { limit: 1 });
      
      if (results.length > 0) {
        const youtubeUrl = results[0].url;
        return getYouTubeStream(youtubeUrl);
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting Apple Music stream:', error);
    return null;
  }
}

/**
 * Get a stream for a direct audio URL
 */
export async function getDirectStream(url: string): Promise<Readable | null> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.statusText}`);
    }

    // Return the response body as a stream
    return response.body as unknown as Readable;
  } catch (error) {
    console.error('Error getting direct stream:', error);
    return null;
  }
}

/**
 * Create an audio resource from a stream
 */
export function createAudioResourceFromStream(
  stream: Readable,
  streamType: StreamType = StreamType.Arbitrary
): AudioResource {
  return createAudioResource(stream, { inputType: streamType });
}

/**
 * Get stream for any song
 */
export async function getSongStream(
  source: 'youtube' | 'spotify' | 'apple-music' | 'direct' | 'search',
  url: string,
  trackName?: string
): Promise<Readable | null> {
  switch (source) {
    case 'youtube':
      return getYouTubeStream(url);
    case 'spotify':
      return getSpotifyStream(url, trackName || 'song');
    case 'apple-music':
      return getAppleMusicStream(url, trackName || 'song');
    case 'direct':
      return getDirectStream(url);
    case 'search':
      // For search, we need the track name to search on YouTube
      try {
        const play = require('play-dl');
        if (play && play.search) {
          const results = await play.search(trackName || url, { limit: 1 });
          if (results.length > 0) {
            return getYouTubeStream(results[0].url);
          }
        }
      } catch (e) {
        console.error('Error searching:', e);
      }
      return null;
    default:
      return null;
  }
}
