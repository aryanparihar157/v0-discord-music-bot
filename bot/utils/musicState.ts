import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, getVoiceConnection } from '@discordjs/voice';
import { Guild, VoiceChannel } from 'discord.js';
import { getSongStream, createAudioResourceFromStream } from './streaming';

export interface Song {
  title: string;
  url: string;
  source: 'youtube' | 'spotify' | 'apple-music' | 'direct' | 'search';
  duration?: number;
  addedBy: string;
}

export interface MusicState {
  guildId: string;
  queue: Song[];
  player: AudioPlayer;
  currentSong?: Song;
  isPlaying: boolean;
  isPaused: boolean;
  volume: number;
  voiceChannel?: VoiceChannel;
}

const musicStates = new Map<string, MusicState>();

export function getOrCreateMusicState(guild: Guild): MusicState {
  const guildId = guild.id;
  
  if (!musicStates.has(guildId)) {
    const player = createAudioPlayer();
    
    player.on(AudioPlayerStatus.Idle, () => {
      const state = musicStates.get(guildId);
      if (state && state.queue.length > 0) {
        state.currentSong = state.queue.shift();
        playNextSong(state);
      } else if (state) {
        state.isPlaying = false;
        state.currentSong = undefined;
      }
    });

    musicStates.set(guildId, {
      guildId,
      queue: [],
      player,
      isPlaying: false,
      isPaused: false,
      volume: 1,
    });
  }

  return musicStates.get(guildId)!;
}

export function getMusicState(guildId: string): MusicState | undefined {
  return musicStates.get(guildId);
}

export async function playNextSong(state: MusicState): Promise<void> {
  if (!state.currentSong) {
    console.log('[v0] No current song to play');
    return;
  }

  try {
    console.log(`[v0] Attempting to play: ${state.currentSong.title} (source: ${state.currentSong.source})`);
    
    // Get the stream for the song
    const stream = await getSongStream(
      state.currentSong.source,
      state.currentSong.url,
      state.currentSong.title
    );

    if (!stream) {
      console.warn(`[v0] Could not get stream for ${state.currentSong.title}`);
      state.isPlaying = false;
      
      // Skip to next song if available
      if (state.queue.length > 0) {
        console.log(`[v0] Moving to next song in queue`);
        state.currentSong = state.queue.shift();
        await playNextSong(state);
      }
      return;
    }

    // Create audio resource and play
    console.log(`[v0] Creating audio resource for ${state.currentSong.title}`);
    const resource = createAudioResourceFromStream(stream);
    
    console.log(`[v0] Playing resource...`);
    state.player.play(resource);
    state.isPlaying = true;
    state.isPaused = false;
    console.log(`[v0] ✓ Now playing: ${state.currentSong.title}`);
  } catch (error) {
    console.error('[v0] Error playing song:', error);
    state.isPlaying = false;
    
    // Try next song on error
    if (state.queue.length > 0) {
      console.log(`[v0] Error occurred, skipping to next song`);
      state.currentSong = state.queue.shift();
      await playNextSong(state);
    }
  }
}

export function addToQueue(state: MusicState, song: Song): void {
  state.queue.push(song);
}

export function skipSong(state: MusicState): Song | undefined {
  const skipped = state.currentSong;
  if (state.player) {
    state.player.stop();
  }
  return skipped;
}

export function pausePlayback(state: MusicState): boolean {
  if (state.player && state.isPlaying) {
    state.player.pause();
    state.isPaused = true;
    return true;
  }
  return false;
}

export function resumePlayback(state: MusicState): boolean {
  if (state.player && state.isPaused) {
    state.player.unpause();
    state.isPaused = false;
    return true;
  }
  return false;
}

export function stopPlayback(state: MusicState): void {
  state.queue = [];
  state.currentSong = undefined;
  state.isPlaying = false;
  state.isPaused = false;
  if (state.player) {
    state.player.stop();
  }
  const connection = getVoiceConnection(state.guildId);
  if (connection) {
    connection.destroy();
  }
}

export function setVolume(state: MusicState, volume: number): void {
  const clampedVolume = Math.max(0, Math.min(2, volume)); // Clamp between 0 and 2
  state.volume = clampedVolume;
}

export function clearMusicState(guildId: string): void {
  musicStates.delete(guildId);
}
