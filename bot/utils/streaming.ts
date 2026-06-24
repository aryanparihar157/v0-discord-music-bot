import { createAudioResource, AudioResource, StreamType } from '@discordjs/voice';
import { Readable } from 'stream';
import { spawn, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

let cachedYtDlpPath: string | null = null;

async function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    const file = fs.createWriteStream(dest);
    const request = (currentUrl: string) => {
      https.get(currentUrl, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          request(response.headers.location!);
          return;
        }
        if (response.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => {});
          reject(new Error(`Failed to download: Status Code ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve());
        });
      }).on('error', (err) => {
        file.close();
        fs.unlink(dest, () => {});
        reject(err);
      });
    };
    request(url);
  });
}

export async function ensureYtDlp(): Promise<string> {
  if (cachedYtDlpPath) return cachedYtDlpPath;

  // 1. Check if global yt-dlp is available
  try {
    execSync('yt-dlp --version', { stdio: 'ignore' });
    console.log('[v0] Using global yt-dlp installation.');
    cachedYtDlpPath = 'yt-dlp';
    return 'yt-dlp';
  } catch (e) {
    // Global not found, proceed to local binary check
  }

  const isWindows = process.platform === 'win32';
  const isMac = process.platform === 'darwin';
  const isLinux = process.platform === 'linux';

  const filename = isWindows ? 'yt-dlp.exe' : 'yt-dlp';
  const binDir = path.join(process.cwd(), 'bin');
  const localPath = path.join(binDir, filename);

  if (fs.existsSync(localPath)) {
    console.log(`[v0] Using local yt-dlp at: ${localPath}`);
    cachedYtDlpPath = localPath;
    return localPath;
  }

  // 2. Download local yt-dlp if not found
  let downloadUrl = '';
  if (isWindows) {
    downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe';
  } else if (isMac) {
    downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos';
  } else if (isLinux) {
    downloadUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';
  } else {
    throw new Error(`Unsupported platform: ${process.platform}. Please install yt-dlp manually.`);
  }

  console.log(`[v0] Local yt-dlp not found. Downloading for ${process.platform} from: ${downloadUrl}`);
  await downloadFile(downloadUrl, localPath);

  if (!isWindows) {
    fs.chmodSync(localPath, '755');
  }

  console.log(`[v0] yt-dlp successfully downloaded and configured at: ${localPath}`);
  cachedYtDlpPath = localPath;
  return localPath;
}

/**
 * Get a stream for a YouTube video
 */
export async function getYouTubeStream(url: string): Promise<Readable | null> {
  try {
    console.log(`[v0] Getting YouTube stream for: ${url}`);
    const ytDlpPath = await ensureYtDlp();
    
    console.log(`[v0] Spawning yt-dlp process to stream audio`);
    const child = spawn(ytDlpPath, [
      '-f', 'bestaudio',
      '-o', '-',
      '--no-playlist',
      url
    ]);

    // Forward stderr to log warnings/errors (excluding the JS runtime warning)
    child.stderr.on('data', (data: Buffer) => {
      const msg = data.toString().trim();
      if (msg && !msg.includes('No supported JavaScript runtime')) {
        console.warn(`[yt-dlp stderr] ${msg}`);
      }
    });

    // Make sure we kill the child process if the stream is destroyed or closed
    child.stdout.on('close', () => {
      if (!child.killed) {
        child.kill();
      }
    });

    child.stdout.on('end', () => {
      if (!child.killed) {
        child.kill();
      }
    });

    child.on('error', (err: Error) => {
      console.error('[v0] yt-dlp child process error:', err);
    });

    return child.stdout;
  } catch (error) {
    console.error('[v0] Error getting YouTube stream:', error);
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
  console.log(`[v0] Creating audio resource with stream type: ${streamType}`);
  try {
    const resource = createAudioResource(stream, { 
      inputType: streamType,
      inlineVolume: true,
    });
    return resource;
  } catch (error) {
    console.error(`[v0] Error creating audio resource:`, error);
    throw error;
  }
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
