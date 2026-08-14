import { 
  AudioPlayer, 
  AudioPlayerStatus, 
  createAudioPlayer, 
  createAudioResource, 
  VoiceConnection, 
  getVoiceConnection, 
  StreamType, 
  AudioResource 
} from '@discordjs/voice';
import { getAudioStream } from './ytDlp';

export interface Song {
  title: string;
  url: string;
  duration?: number;
  addedBy: string;
}

export class MusicPlayer {
  private static players = new Map<string, MusicPlayer>();

  public readonly guildId: string;
  public queue: Song[] = [];
  public currentSong: Song | null = null;
  public audioPlayer: AudioPlayer;
  public connection: VoiceConnection | null = null;
  public volume: number = 0.5; // Default volume: 50%
  private currentResource: AudioResource | null = null;
  private disconnectTimeout: NodeJS.Timeout | null = null;

  private constructor(guildId: string) {
    this.guildId = guildId;
    this.audioPlayer = createAudioPlayer();
    this.setupPlayerListeners();
  }

  public static getOrCreate(guildId: string): MusicPlayer {
    let player = this.players.get(guildId);
    if (!player) {
      player = new MusicPlayer(guildId);
      this.players.set(guildId, player);
    }
    return player;
  }

  public static delete(guildId: string): void {
    const player = this.players.get(guildId);
    if (player) {
      player.stop();
      this.players.delete(guildId);
    }
  }

  private setupPlayerListeners(): void {
    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      console.log(`[v0] AudioPlayer idle in guild ${this.guildId}`);
      this.currentSong = null;
      this.currentResource = null;
      this.playNext();
    });

    this.audioPlayer.on('error', (error) => {
      console.error(`[v0] AudioPlayer error in guild ${this.guildId}:`, error.message, error);
      this.currentSong = null;
      this.currentResource = null;
      this.playNext();
    });

    this.audioPlayer.on('stateChange', (oldState, newState) => {
      console.log(`[v0] AudioPlayer state changed from ${oldState.status} to ${newState.status}`);
    });
  }

  public setConnection(connection: VoiceConnection): void {
    this.connection = connection;
    this.connection.subscribe(this.audioPlayer);
    this.clearDisconnectTimeout();
  }

  public addToQueue(song: Song): void {
    this.queue.push(song);
    this.clearDisconnectTimeout();
    if (this.audioPlayer.state.status === AudioPlayerStatus.Idle && !this.currentSong) {
      this.playNext();
    }
  }

  public async playNext(): Promise<void> {
    if (this.queue.length === 0) {
      console.log(`[v0] Queue finished in guild ${this.guildId}. Starting disconnect timer.`);
      this.startDisconnectTimeout();
      return;
    }

    this.clearDisconnectTimeout();
    const song = this.queue.shift()!;
    this.currentSong = song;

    try {
      console.log(`[v0] Playing next song: "${song.title}" in guild ${this.guildId}`);
      const stream = await getAudioStream(song.url);
      
      this.currentResource = createAudioResource(stream, {
        inputType: StreamType.Arbitrary,
        inlineVolume: true,
      });

      this.currentResource.volume?.setVolume(this.volume);
      this.audioPlayer.play(this.currentResource);
    } catch (error) {
      console.error(`[v0] Error playing song "${song.title}":`, error);
      this.playNext();
    }
  }

  public skip(): boolean {
    if (!this.currentSong && this.queue.length === 0) return false;
    this.audioPlayer.stop();
    return true;
  }

  public pause(): boolean {
    if (this.audioPlayer.state.status !== AudioPlayerStatus.Playing) return false;
    return this.audioPlayer.pause();
  }

  public resume(): boolean {
    if (this.audioPlayer.state.status !== AudioPlayerStatus.Paused) return false;
    return this.audioPlayer.unpause();
  }

  public stop(): void {
    this.queue = [];
    this.currentSong = null;
    this.currentResource = null;
    this.audioPlayer.stop(true);
    
    if (this.connection) {
      this.connection.destroy();
      this.connection = null;
    } else {
      const conn = getVoiceConnection(this.guildId);
      if (conn) conn.destroy();
    }
    this.clearDisconnectTimeout();
  }

  public setVolume(volume: number): void {
    // Volume expects a value between 0.0 and 1.0 (or higher, clamped)
    const clampedVolume = Math.max(0, Math.min(2, volume));
    this.volume = clampedVolume;
    if (this.currentResource?.volume) {
      this.currentResource.volume.setVolume(clampedVolume);
    }
  }

  private startDisconnectTimeout(): void {
    this.clearDisconnectTimeout();
    // Automatically disconnect after 2 minutes of inactivity
    this.disconnectTimeout = setTimeout(() => {
      console.log(`[v0] Disconnecting due to inactivity in guild ${this.guildId}`);
      this.stop();
    }, 2 * 60 * 1000);
  }

  private clearDisconnectTimeout(): void {
    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
      this.disconnectTimeout = null;
    }
  }
}
