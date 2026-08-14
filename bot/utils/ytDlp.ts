import { spawn, execSync } from 'child_process';
import { Readable } from 'stream';
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

  // 1. Check if global yt-dlp is available in PATH
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
 * Spawns a yt-dlp process to stream audio from a YouTube URL
 */
export async function getAudioStream(url: string): Promise<Readable> {
  const ytDlpPath = await ensureYtDlp();
  console.log(`[v0] Spawning yt-dlp process for URL: ${url}`);

  const child = spawn(ytDlpPath, [
    '-f', 'bestaudio',
    '-o', '-',
    '--no-playlist',
    url
  ]);

  child.stderr.on('data', (data: Buffer) => {
    const msg = data.toString().trim();
    if (msg && !msg.includes('No supported JavaScript runtime')) {
      console.warn(`[yt-dlp stderr] ${msg}`);
    }
  });

  child.stdout.on('close', () => {
    if (!child.killed) child.kill();
  });

  child.stdout.on('end', () => {
    if (!child.killed) child.kill();
  });

  child.on('error', (err: Error) => {
    console.error('[v0] yt-dlp child process error:', err);
  });

  return child.stdout;
}

export interface ResolvedSong {
  title: string;
  url: string;
  duration?: number;
}

/**
 * Resolves a search query or URL into song metadata using yt-dlp
 */
export async function resolveSong(query: string): Promise<ResolvedSong | null> {
  try {
    const ytDlpPath = await ensureYtDlp();
    const isUrl = query.startsWith('http://') || query.startsWith('https://');
    const target = isUrl ? query : `ytsearch1:${query.replace(/"/g, '\\"')}`;

    console.log(`[v0] Resolving metadata for target: ${target}`);
    const output = execSync(
      `"${ytDlpPath}" "${target}" --dump-json --flat-playlist`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }
    );

    const lines = output.trim().split('\n');
    if (lines.length > 0 && lines[0].trim()) {
      const item = JSON.parse(lines[0].trim());
      return {
        title: item.title || query,
        url: item.webpage_url || item.url || `https://www.youtube.com/watch?v=${item.id}`,
        duration: item.duration || undefined,
      };
    }
  } catch (error) {
    console.error('[v0] yt-dlp resolve error:', error);
  }
  return null;
}

