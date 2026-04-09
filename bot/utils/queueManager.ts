import { MusicState, Song } from './musicState';

/**
 * Get songs in queue with metadata
 */
export function getQueueWithMetadata(state: MusicState) {
  const totalDuration = state.queue.reduce((sum, song) => sum + (song.duration || 0), 0);
  const minutes = Math.floor(totalDuration / 60);
  const seconds = totalDuration % 60;

  return {
    count: state.queue.length,
    songs: state.queue,
    totalDuration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    formattedQueue: state.queue.map((song, index) => ({
      position: index + 1,
      title: song.title,
      duration: song.duration,
      addedBy: song.addedBy,
      source: song.source,
    })),
  };
}

/**
 * Get queue page (for pagination)
 */
export function getQueuePage(state: MusicState, page: number = 1, pageSize: number = 10) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageSongs = state.queue.slice(start, end);
  const totalPages = Math.ceil(state.queue.length / pageSize);

  return {
    page,
    pageSize,
    totalPages,
    totalSongs: state.queue.length,
    songs: pageSongs.map((song, index) => ({
      position: start + index + 1,
      title: song.title,
      duration: song.duration,
      addedBy: song.addedBy,
    })),
  };
}

/**
 * Remove song at position
 */
export function removeSongAtPosition(state: MusicState, position: number): Song | null {
  if (position < 1 || position > state.queue.length) {
    return null;
  }

  const removed = state.queue.splice(position - 1, 1);
  return removed[0] || null;
}

/**
 * Move song in queue
 */
export function moveSongInQueue(
  state: MusicState,
  fromPosition: number,
  toPosition: number
): boolean {
  if (
    fromPosition < 1 ||
    fromPosition > state.queue.length ||
    toPosition < 1 ||
    toPosition > state.queue.length
  ) {
    return false;
  }

  const song = state.queue.splice(fromPosition - 1, 1)[0];
  state.queue.splice(toPosition - 1, 0, song);
  return true;
}

/**
 * Jump to song in queue
 */
export function jumpToPosition(state: MusicState, position: number): Song | null {
  if (position < 1 || position > state.queue.length) {
    return null;
  }

  const songsToPlay = state.queue.splice(0, position - 1);
  const jumpedSong = state.queue[0];

  // Add skipped songs to front for history
  state.queue.unshift(...songsToPlay);

  return jumpedSong || null;
}

/**
 * Get estimated time until a song plays
 */
export function getTimeUntilSong(state: MusicState, position: number): string | null {
  if (position < 1 || position > state.queue.length) {
    return null;
  }

  // Calculate time until this song plays
  let totalSeconds = 0;

  // Add current song duration (time remaining)
  if (state.currentSong && state.currentSong.duration) {
    totalSeconds += state.currentSong.duration;
  }

  // Add durations of songs before this position
  for (let i = 0; i < position - 1; i++) {
    if (state.queue[i] && state.queue[i].duration) {
      totalSeconds += state.queue[i].duration;
    }
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Check if queue has duplicates
 */
export function hasDuplicates(state: MusicState): boolean {
  const urls = new Set<string>();
  for (const song of state.queue) {
    if (urls.has(song.url)) {
      return true;
    }
    urls.add(song.url);
  }
  return false;
}

/**
 * Remove duplicates from queue
 */
export function removeDuplicates(state: MusicState): number {
  const seen = new Set<string>();
  let removed = 0;

  for (let i = state.queue.length - 1; i >= 0; i--) {
    if (seen.has(state.queue[i].url)) {
      state.queue.splice(i, 1);
      removed++;
    } else {
      seen.add(state.queue[i].url);
    }
  }

  return removed;
}

/**
 * Get queue statistics
 */
export function getQueueStats(state: MusicState) {
  const totalDuration = state.queue.reduce((sum, song) => sum + (song.duration || 0), 0);
  const uniqueUsers = new Set(state.queue.map(song => song.addedBy)).size;
  const sourceBreakdown = state.queue.reduce(
    (acc, song) => {
      acc[song.source] = (acc[song.source] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalSongs: state.queue.length,
    totalDuration,
    minutesHours: `${Math.floor(totalDuration / 60)}m`,
    uniqueUsers,
    sourceBreakdown,
  };
}
