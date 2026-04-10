# Discord Music Bot - Test Checklist

## Pre-Test Verification
- [x] Fixed play-dl version to ^1.9.7 (was 1.10.5 which doesn't exist)
- [x] Created .eslintrc.json for proper ESLint configuration
- [x] Updated slash command handler with real playback logic
- [x] Added voice connection subscription (connection.subscribe)
- [x] Enhanced logging throughout music system with [v0] prefix

## Bot Deployment Tests

### 1. Deploy to Vercel
- [ ] Push code to GitHub
- [ ] Wait for Vercel deployment to complete
- [ ] Note the deployment URL (e.g., https://bot-name.vercel.app)

### 2. Configure Discord Webhook
- [ ] Go to Discord Developer Portal
- [ ] Select your bot application
- [ ] Go to General Information tab
- [ ] Set Interactions Endpoint URL to: `https://your-vercel-url.vercel.app/api/discord/interactions`
- [ ] Click Save

### 3. Register Commands
- [ ] Visit `https://your-vercel-url.vercel.app/setup`
- [ ] Click "Register Commands" button
- [ ] Verify all 12 commands are registered (shows green check)

### 4. Invite Bot to Server
- [ ] On setup page, click "Invite Bot to Server"
- [ ] Select your Discord server
- [ ] Authorize permissions
- [ ] Bot should appear in your server member list

## Functional Tests (In Discord)

### Test 1: /play Command - YouTube Search
- [ ] Type `/play cute cat videos`
- [ ] Bot responds with song title and "Added to queue"
- [ ] Bot joins voice channel
- [ ] **CRITICAL: Audio should play in voice channel**
- [ ] Check console logs for [v0] messages showing playback starting

### Test 2: /play Command - Direct YouTube Link
- [ ] Type `/play https://www.youtube.com/watch?v=[VIDEO_ID]`
- [ ] Bot responds immediately
- [ ] **CRITICAL: Audio should play**
- [ ] If already playing, should queue and play after current song

### Test 3: /queue Command
- [ ] Type `/queue`
- [ ] Shows currently playing song (with ▶️ icon)
- [ ] Shows up to 10 songs in queue
- [ ] Displays correct "Added by" usernames

### Test 4: /pause and /resume
- [ ] Play a song
- [ ] Type `/pause` 
- [ ] Audio should stop immediately (⏸️ icon shown in console)
- [ ] Type `/resume`
- [ ] Audio resumes from where it paused

### Test 5: /skip Command
- [ ] Play a song with songs in queue
- [ ] Type `/skip`
- [ ] Current song stops, next song in queue plays
- [ ] Shows which song was skipped and what's now playing

### Test 6: /stop Command
- [ ] Play multiple songs
- [ ] Type `/stop`
- [ ] Audio stops completely
- [ ] Queue is cleared
- [ ] Bot stays in voice channel but doesn't play

### Test 7: /volume Command
- [ ] Type `/volume 50`
- [ ] Volume should adjust (check if audio gets quieter)
- [ ] Type `/volume 150`
- [ ] Volume increases (if supported)
- [ ] Type `/volume 0`
- [ ] Audio should be silent

### Test 8: /nowplaying Command
- [ ] While song is playing, type `/nowplaying`
- [ ] Shows currently playing song title
- [ ] Shows source (YouTube, Spotify, etc)
- [ ] Shows who requested the song

### Test 9: Multiple Users Queuing
- [ ] Have 2+ users in voice channel
- [ ] User 1 types `/play song 1`
- [ ] User 2 types `/play song 2`
- [ ] Song 1 plays, then song 2 plays
- [ ] Queue shows both with correct "Added by" names

### Test 10: Bot Voice Channel Management
- [ ] Bot is in voice channel playing
- [ ] User leaves voice channel
- [ ] Bot should stay in channel (or leave after timeout)
- [ ] New user joins, commands still work
- [ ] All users leave, bot leaves channel

## Console Log Verification

When testing playback, check console logs for these messages:
```
[v0] Added "song title" to queue
[v0] Starting playback of: song title
[v0] Getting YouTube stream for: [url]
[v0] Using play-dl to stream from YouTube
[v0] ✓ YouTube stream ready
[v0] Creating audio resource...
[v0] Playing resource...
[v0] ✓ Now playing: song title
```

If ANY [v0] ERROR appears, this is critical and needs investigation.

## Debugging Tips

1. **Check Discord Webhook URL**: If commands don't work, webhook might not be set
2. **Register Commands**: Commands must be registered before they appear with `/`
3. **Voice Permission**: Bot needs "Connect" and "Speak" permissions in voice channel
4. **Stream Errors**: Check console for [v0] error messages during playback
5. **Audio Not Playing**: Verify connection.subscribe(player) is being called

## Expected Results
- All 12 commands appear when typing `/`
- Songs play audio in voice channel (not just queue)
- Queue shows correct song order
- Playback controls work immediately
- Multiple users can queue songs
- Console shows [v0] logs for every action

## Critical Fixes Applied
1. ✓ Slash command handler now uses actual music state
2. ✓ Voice connection is subscribed to audio player
3. ✓ playNextSong() is called after /play
4. ✓ play-dl version fixed to 1.9.7
5. ✓ Comprehensive logging with [v0] prefix
