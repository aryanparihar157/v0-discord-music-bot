import { parseMusicUrl } from './musicSearch';

describe('musicSearch', () => {
  describe('parseMusicUrl', () => {
    it('should parse YouTube URLs', async () => {
      const result = await parseMusicUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      expect(result).not.toBeNull();
      expect(result?.source).toBe('youtube');
    });

    it('should parse Spotify URLs', async () => {
      const result = await parseMusicUrl('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT');
      expect(result).not.toBeNull();
      expect(result?.source).toBe('spotify');
    });

    it('should parse Apple Music URLs', async () => {
      const result = await parseMusicUrl('https://music.apple.com/us/album/song-name/123456789');
      expect(result).not.toBeNull();
      expect(result?.source).toBe('apple-music');
    });

    it('should parse direct audio URLs', async () => {
      const result = await parseMusicUrl('https://example.com/audio.mp3');
      expect(result).not.toBeNull();
      expect(result?.source).toBe('direct');
    });

    it('should return null for invalid URLs', async () => {
      const result = await parseMusicUrl('not-a-url');
      expect(result).toBeNull();
    });
  });
});
