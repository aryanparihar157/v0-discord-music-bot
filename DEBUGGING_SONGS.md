# Discord Music Bot - Song Playback Debugging Guide

## Critical Issues Fixed

### 1. **Songs Not Playing - Root Cause**
The slash command handler was NOT actually queuing or playing songs. It was just showing a message response without interacting with the music state system.

**Fix Applied:**
- Updated `slashCommandHandler.ts` to properly call `getOrCreateMusicState()`, `addToQueue()`, and `playNextSong()`
- Added proper voice channel joining and subscription to the player
- Added comprehensive logging with `[v0]` prefix for debugging

### 2. **Voice Connection Not Subscribed**
The audio player wasn't subscribed to the voice connection, so even if songs were queued, they couldn't be heard.

**Fix Applied:**
- Added `connection.subscribe(musicState.player)` in the play command
- This ensures audio from the player is sent to the voice channel

### 3. **Missing Playback State Management**
Commands like pause, resume, skip, and stop were not actually controlling playback.

**Fix Applied:**
- Implemented actual player control in handlers:
  - `pause`: Calls `player.pause()` and sets `isPaused` flag
  - `resume`: Calls `player.unpause()` and clears `isPaused` flag
  - `skip`: Calls `player.stop()` to trigger next song
  - `stop`: Clears queue and stops player

### 4. **Poor Error Handling in Streaming**
Errors during stream creation weren't properly logged.

**Fix Applied:**
- Added detailed logging at each streaming step
- Added error handling in `createAudioResourceFromStream()`
- Added fallback behavior when streams fail

## How Song Playback Works Now

1. **User runs `/play song-name`**
   - Slash command handler receives interaction
   - Logs: `[v0] Added "song-name" to queue...`

2. **Handler processes the query**
   - If URL: Uses `parseMusicUrl()`
   - If search: Uses `searchMusic()` 
   - Logs: `[v0] Processing song...`

3. **Song added to queue**
   - Handler calls `addToQueue(musicState, song)`
   - Logs: `[v0] Added "song-name" to queue for guild...`

4. **Check if should start playing**
   - If nothing is playing: `playNextSong(musicState)` is called
   - Logs: `[v0] Starting playback of: song-name`

5. **Get stream from source**
   - Calls `getSongStream()` which routes to appropriate function
   - For YouTube: Uses `play-dl` library
   - Logs: `[v0] Getting YouTube stream for: URL`
   - Logs: `[v0] ✓ YouTube stream ready`

6. **Create audio resource**
   - Converts stream to Discord audio resource
   - Logs: `[v0] Creating audio resource for song-name`

7. **Play resource**
   - Calls `player.play(resource)`
   - Logs: `[v0] Playing resource...`
   - Logs: `[v0] ✓ Now playing: song-name`

8. **When song ends**
   - Player emits `AudioPlayerStatus.Idle`
   - Next song in queue starts automatically

## Testing Checklist

- [ ] Bot joins voice channel when first song is played
- [ ] Songs appear in queue with `/queue` command
- [ ] Now playing shows current song with `/nowplaying`
- [ ] `/pause` stops audio
- [ ] `/resume` continues audio
- [ ] `/skip` plays next song
- [ ] `/stop` clears queue and stops
- [ ] Multiple songs queue correctly
- [ ] Console shows `[v0]` debug logs for each step

## Console Log Examples (Look for these)

### Success Path:
```
[v0] Added "song-name" to queue for guild abc123
[v0] Started playing: song-name
[v0] Getting YouTube stream for: https://youtube.com/watch?v=...
[v0] ✓ YouTube stream ready
[v0] Creating audio resource for song-name
[v0] Playing resource...
[v0] ✓ Now playing: song-name
```

### Error Path:
```
[v0] Could not get stream for song-name
[v0] Moving to next song in queue
[v0] Error occurred, skipping to next song
```

## Common Issues & Fixes

### Issue: Bot joins but no sound
- Check: Is voice connection subscribed? (Look for voice manager logging)
- Fix: Verify `connection.subscribe(player)` is called

### Issue: Song queues but shows "⏸️ Queued" instead of "▶️ Playing"
- Check: Is `playNextSong()` being called?
- Look for: `[v0] Starting playback of:` log
- Fix: Ensure `musicState.isPlaying` is set correctly

### Issue: YouTube stream fails
- Check: Is `play-dl` installed? 
- Fix: Verify it's in package.json and node_modules
- Fallback: Bot should skip to next song on error

### Issue: No `[v0]` logs in console
- Check: Are you looking at the right logs?
- Vercel: Check function logs in Vercel dashboard
- Local: Check terminal output

## Files Modified

1. **`bot/handlers/slashCommandHandler.ts`** - Now actually handles commands
2. **`bot/commands/play.ts`** - Added voice connection subscription
3. **`bot/utils/musicState.ts`** - Enhanced logging and error handling
4. **`bot/utils/streaming.ts`** - Better error handling and logging

## Next Steps if Issues Persist

1. Check `/api/discord/interactions` endpoint is receiving requests
2. Verify voice connection exists in `musicState.voiceChannel`
3. Check if `play-dl` package is working: test with simple stream
4. Review player status events in logs
5. Check voice channel permissions: Connect, Speak, View Channel
