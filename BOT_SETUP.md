# Discord Music Bot Setup Guide

This is a complete Discord music bot integrated into your Next.js application. It supports playing songs from YouTube, Spotify, Apple Music, and direct audio links.

## Prerequisites

- Node.js 16+
- A Discord server where you have admin permissions
- Discord application credentials (Bot Token, Client ID)

## Step 1: Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" tab and click "Add Bot"
4. Under the TOKEN section, click "Copy" to copy your bot token
5. Go to the "OAuth2" tab and:
   - Select "bot" in the SCOPES section
   - Select these PERMISSIONS:
     - Read Messages/View Channels
     - Send Messages
     - Use Slash Commands
     - Connect (Voice)
     - Speak (Voice)
     - Use Voice Activity

6. Copy the generated URL and open it in your browser to add the bot to your server

## Step 2: Configure Environment Variables

Add these variables to your `.env.local` file:

```
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_server_id_here (optional, for testing)
SPOTIFY_CLIENT_ID=your_spotify_client_id (optional)
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret (optional)
```

### Getting Your Guild ID (Server ID)

1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
2. Right-click your server name and select "Copy Server ID"
3. Paste it as `DISCORD_GUILD_ID`

### (Optional) Spotify Integration

For Spotify search support:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create an app and get your Client ID and Client Secret
3. Add them to your environment variables

## Step 3: Deploy Commands

Run this command to register slash commands with Discord:

```bash
npm run deploy-commands
```

Or for development with a specific guild:

```bash
DISCORD_GUILD_ID=your_server_id npm run deploy-commands
```

## Step 4: Start the Bot

### Option A: Run as a background process

```bash
npm run bot:start
```

### Option B: Run through the API

Make a POST request to:

```
POST /api/bot/start
```

### Option C: Run during development

```bash
npm run dev
```

Then call the API endpoint to start the bot.

## Available Commands

Once the bot is running and commands are deployed, use these slash commands in your Discord server:

### `/play <query>`
Play a song by:
- Song name: `/play never gonna give you up`
- YouTube link: `/play https://www.youtube.com/watch?v=...`
- Spotify link: `/play https://open.spotify.com/track/...`
- Apple Music link: `/play https://music.apple.com/...`

### `/queue`
View the current music queue and playback status

### `/pause`
Pause the currently playing song

### `/resume`
Resume playback of a paused song

### `/skip`
Skip the current song and play the next one

### `/stop`
Stop playback and clear the entire queue

### `/volume <level>`
Set the playback volume (0-200%)

## Features

✅ Search and play songs by name
✅ YouTube link support
✅ Spotify link and search support
✅ Apple Music support
✅ Direct audio file links
✅ Queue management
✅ Playback controls (pause, resume, skip, stop)
✅ Volume control
✅ Shows current song and queue information

## Troubleshooting

### "Bot is offline" or "Bot is not responding"

1. Check that `DISCORD_TOKEN` is set correctly in your environment
2. Ensure the bot has been added to your server
3. Check the bot has the required permissions in voice channels
4. Run `/deploy-commands` again to refresh command registration

### "I don't have permission to join your voice channel"

1. Go to your server settings → Channels
2. Select your voice channel → Edit Channel
3. Go to Permissions tab
4. Find the bot role and ensure "Connect" and "Speak" are enabled

### Spotify search not working

1. Verify `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are set
2. Check that your Spotify app credentials are valid
3. Ensure the credentials are not expired

### Songs are not playing

Currently, the bot framework is set up but requires additional streaming libraries:
- Install `play-dl` for YouTube streaming: `npm install play-dl`
- The bot will queue songs but may need additional setup for actual audio streaming

## Development

The bot code is located in `/bot` directory:

- `/bot/index.ts` - Main bot client
- `/bot/commands/` - Slash command handlers
- `/bot/utils/musicState.ts` - Queue and playback state management
- `/bot/utils/musicSearch.ts` - Music search across multiple sources
- `/bot/deploy-commands.ts` - Command registration script

## Next Steps

To enable actual audio streaming (currently the bot queues songs but doesn't play audio):

1. Install `play-dl`: `npm install play-dl`
2. Update `/bot/utils/musicSearch.ts` to use actual streaming
3. Implement audio resource creation in `musicState.ts`
4. Update the play command to actually stream audio

## Support

For issues with:
- Discord API: See [Discord.js Documentation](https://discord.js.org)
- Spotify API: See [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- Your bot: Check the console logs for detailed error messages
