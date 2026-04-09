# Discord Music Bot

A feature-rich Discord music bot built with discord.js and integrated into Next.js. Play songs from YouTube, Spotify, Apple Music, and direct audio links with an easy-to-use interface.

## Features

✅ **Multi-Source Music Support**
- YouTube videos and playlists
- Spotify tracks and playlists
- Apple Music integration
- Direct audio file links
- Search by song name

✅ **Complete Playback Control**
- Play/Pause/Resume
- Skip songs
- Queue management
- Volume control (0-200%)
- Shuffle functionality

✅ **Advanced Queue Features**
- View full queue with duration
- See upcoming songs
- Clear queue
- Remove specific songs
- Shuffle songs

✅ **Easy to Use**
- Slash commands (/)
- Beautiful embed messages
- Real-time queue display
- Current song information

✅ **Deployable**
- Works on Vercel
- Self-hostable on VPS
- Compatible with Railway, Heroku, and more
- Automatic command registration

## Quick Start

### 1. Prerequisites

- Discord Server (admin access)
- Node.js 16+ 
- Discord Application (Bot Token & Client ID)

### 2. Create Discord Bot Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Go to "Bot" tab → "Add Bot"
4. Copy the TOKEN
5. Go to "OAuth2" → "URL Generator"
   - Scopes: `bot`
   - Permissions: `Send Messages`, `Use Slash Commands`, `Connect`, `Speak`
6. Copy the generated URL and open it to add bot to your server

### 3. Setup Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:
```
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_GUILD_ID=your_server_id  # Optional, for testing
```

### 4. Install & Deploy

```bash
# Install dependencies
npm install

# Deploy slash commands
npm run deploy-commands

# Start the bot
npm run bot:start
```

### 5. Try Commands in Discord

Type `/` in a Discord channel to see available commands!

## Commands

### Playback
- `/play <query>` - Play a song
- `/pause` - Pause current song
- `/resume` - Resume playback
- `/skip` - Skip to next song
- `/stop` - Stop and clear queue

### Queue
- `/queue` - View current queue
- `/nowplaying` - Show current song
- `/clearqueue` - Clear all songs
- `/shuffle` - Randomize queue

### Info
- `/help` - Show all commands
- `/botinfo` - Bot information
- `/volume <0-200>` - Set volume

## Usage Examples

```
/play never gonna give you up
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ
/play https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqLv
/queue
/skip
/volume 80
```

## Project Structure

```
/bot
  ├── index.ts                 # Main bot client
  ├── types.d.ts              # TypeScript types
  ├── deploy-commands.ts       # Command registration
  ├── commands/                # Slash command handlers
  │   ├── play.ts
  │   ├── pause.ts
  │   ├── resume.ts
  │   ├── skip.ts
  │   ├── stop.ts
  │   ├── queue.ts
  │   ├── volume.ts
  │   ├── nowplaying.ts
  │   ├── shuffle.ts
  │   ├── clearqueue.ts
  │   ├── help.ts
  │   └── botinfo.ts
  └── utils/
      ├── musicState.ts        # Queue & playback state
      ├── musicSearch.ts       # Music search service
      ├── streaming.ts         # Audio streaming logic
      └── queueManager.ts      # Queue utilities

/app
  ├── api/bot/start/route.ts   # Bot startup endpoint
  └── bot/page.tsx             # Control dashboard
```

## Configuration

### Environment Variables

See `.env.example` for all available options:

- `DISCORD_TOKEN` - Your bot token (required)
- `DISCORD_CLIENT_ID` - Your client ID (required)
- `DISCORD_GUILD_ID` - Server ID for testing (optional)
- `SPOTIFY_CLIENT_ID` - For Spotify search (optional)
- `SPOTIFY_CLIENT_SECRET` - For Spotify search (optional)

### Bot Settings

Edit `/bot/index.ts` to customize:
- Gateway intents
- Command handling
- Error responses

## Deployment

### Local Development

```bash
npm run dev
# Then POST to http://localhost:3000/api/bot/start
```

### Production (Vercel)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

Quick version:
1. Push to GitHub
2. Deploy on Vercel
3. Set environment variables
4. Call `/api/bot/start` endpoint

### Self-Hosted (VPS)

```bash
npm run bot:start
# Or with PM2:
pm2 start "npm run bot:start" --name "music-bot"
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full VPS setup.

## Features Details

### Multi-Source Playback

The bot supports multiple music sources:

| Source | Support | Setup |
|--------|---------|-------|
| YouTube | ✓ Requires play-dl | `npm install play-dl` |
| Spotify | ✓ Search support | Add credentials to `.env.local` |
| Apple Music | ✓ Link & search | Optional API key |
| Direct URLs | ✓ MP3/WAV/FLAC | No setup needed |

### Queue System

- Unlimited queue size (configurable)
- Track duration and total queue time
- Added by tracking (see who queued each song)
- Automatic next song playback
- Duplicate detection

### Advanced Features

- **Shuffle** - Randomize queue order
- **Volume Control** - 0-200% volume adjustment
- **Queue Management** - Add, remove, reorder songs
- **Statistics** - View queue stats and breakdown
- **Search** - Find songs by name across multiple sources

## Troubleshooting

### Bot Not Responding

1. Check if bot is online in Discord
2. Verify token in environment variables
3. Redeploy commands: `npm run deploy-commands`
4. Check bot permissions in server

### Commands Not Showing

- Refresh Discord (restart app)
- Run `npm run deploy-commands` again
- Check bot has "Use Slash Commands" permission

### Audio Not Playing

- Install `play-dl`: `npm install play-dl`
- Check bot has "Speak" permission in voice channel
- Verify ffmpeg is installed on server

### High Latency

- Use geographically closer server
- Reduce queue size
- Monitor memory usage with PM2

## Performance Tips

1. **Limit Queue Size** - Set max songs to prevent memory issues
2. **Cache Results** - Reuse search results
3. **Use Cron Jobs** - Keep bot alive on serverless platforms
4. **Monitor** - Use PM2 or platform monitoring tools

## Contributing

Improvements welcome! Consider:
- Adding new music sources
- Improving streaming quality
- Adding more commands
- Fixing bugs

## License

MIT License - Feel free to use and modify!

## Support

- Issues: Create a GitHub issue
- Discord Help: Check Discord.js documentation
- Deployment Help: See DEPLOYMENT.md

## Related Links

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers)
- [Spotify API](https://developer.spotify.com/)
- [play-dl](https://github.com/play-dl/play-dl)

---

**Made with ❤️ for Discord communities**
