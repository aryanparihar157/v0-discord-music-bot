# 🎵 Discord Music Bot

A powerful, easy-to-deploy Discord music bot built with Next.js, Discord.js, and Vercel.

Play music from **YouTube**, **Spotify**, **Apple Music**, and more in your Discord server.

## 🔧 Updates & Audio Streaming Repair (June 2026)

We have fully repaired and implemented the audio streaming system:
- **`yt-dlp` Streaming Integration**: YouTube's frequent updates broke standard `play-dl` and `ytdl-core` stream deciphering (resulting in `TypeError: Invalid URL` errors). We migrated the stream extraction to use `yt-dlp` which is updated daily to bypass YouTube blocks.
- **Cross-Platform Auto-Downloader**: On startup/first playback, the bot checks if `yt-dlp` is installed globally. If not, it automatically downloads the correct platform-specific binary (Windows, Linux, macOS) into the `./bin` folder.
- **Pure JS Voice Fallback**: Added `opusscript` and `libsodium-wrappers` to ensure the bot can run on systems (like Windows local development) without Visual Studio C++ compilers or build tools.
- **Transcoding Support**: Added `ffmpeg-static` to handle decoding of audio streams automatically.

## 🌟 Features

- ✅ Play songs by name, YouTube links, Spotify URLs, or Apple Music links
- ✅ Full queue management with shuffle and skip
- ✅ Complete playback controls (pause, resume, skip, stop)
- ✅ Volume control (0-200%)
- ✅ Display current song and queue information
- ✅ Easy one-command setup
- ✅ Deployable to Vercel (24/7 uptime)
- ✅ Zero cost to run (Vercel free tier)

## 🚀 Quick Start

### 1. Visit the Setup Page
Once deployed, go to: `https://your-domain.vercel.app/setup`

This will guide you through:
- Creating a Discord application
- Getting your credentials
- Adding environment variables
- Inviting the bot to your server

### 2. Or Follow the Manual Process

**Create Discord Bot:**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to Bot tab and click "Add Bot"
4. Copy your TOKEN, CLIENT ID, and PUBLIC KEY

**Deploy to Vercel:**
1. Push this repo to GitHub
2. Connect to Vercel
3. Add environment variables:
   - `DISCORD_TOKEN`
   - `DISCORD_CLIENT_ID`
   - `DISCORD_PUBLIC_KEY`
4. Deploy

**Configure Discord:**
1. Set Interactions Endpoint URL in Discord Developer Portal to:
   ```
   https://your-vercel-url.vercel.app/api/discord/interactions
   ```

**Invite Bot:**
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=36700160&scope=bot%20applications.commands
```

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist
- **[BOT_SETUP.md](./BOT_SETUP.md)** - Detailed setup instructions
- **[BOT_README.md](./BOT_README.md)** - Full feature documentation

## 💬 Commands

| Command | Usage | Description |
|---------|-------|-------------|
| `/play` | `/play Imagine John Lennon` | Play a song by name or URL |
| `/pause` | `/pause` | Pause playback |
| `/resume` | `/resume` | Resume playback |
| `/skip` | `/skip` | Skip to next song |
| `/stop` | `/stop` | Stop and clear queue |
| `/queue` | `/queue` | Show the music queue |
| `/nowplaying` | `/nowplaying` | Show current song |
| `/volume` | `/volume 80` | Set volume (0-200%) |
| `/shuffle` | `/shuffle` | Shuffle the queue |
| `/clearqueue` | `/clearqueue` | Clear all songs |
| `/help` | `/help` | Show all commands |

## 🎵 Supported Sources

- **YouTube** - Any YouTube video/playlist
- **Spotify** - Search Spotify tracks (requires API keys)
- **Apple Music** - Apple Music links
- **Direct URLs** - Any direct audio link (.mp3, .wav, etc.)
- **Song Names** - Search by song title

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Discord Library**: [Discord.js 14](https://discord.js.org)
- **Audio**: [discord.js/voice](https://github.com/discordjs/voice), [yt-dlp](https://github.com/yt-dlp/yt-dlp) (stream extraction), [play-dl](https://github.com/Androz2091/play-dl) (search fallback), [opusscript](https://github.com/Rapptz/opusscript) (JS Opus fallback), and [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static) (transcoding)
- **Hosting**: [Vercel](https://vercel.com)
- **UI**: [shadcn/ui](https://ui.shadcn.com) with [Tailwind CSS](https://tailwindcss.com)

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                    # Home page
│   ├── setup/page.tsx              # Setup guide
│   ├── bot/page.tsx                # Bot dashboard
│   └── api/
│       └── discord/
│           └── interactions/       # Discord webhook endpoint
├── bot/
│   ├── handlers/
│   │   └── slashCommandHandler.ts  # Command processor
│   ├── commands/                   # Slash command implementations
│   ├── utils/
│   │   ├── musicSearch.ts          # Search songs
│   │   ├── musicState.ts           # Queue & playback state
│   │   ├── streaming.ts            # Audio streaming
│   │   └── queueManager.ts         # Queue utilities
│   └── types.d.ts
├── components/                     # React UI components
├── lib/                            # Utilities
└── scripts/                        # Setup scripts
```

## 🔐 Environment Variables

**Required:**
- `DISCORD_TOKEN` - Bot authentication token
- `DISCORD_CLIENT_ID` - Application Client ID
- `DISCORD_PUBLIC_KEY` - Application Public Key

**Optional:**
- `SPOTIFY_CLIENT_ID` - For Spotify search
- `SPOTIFY_CLIENT_SECRET` - For Spotify search

## 💻 Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Visit http://localhost:3000
```

## 🚀 Deployment

### On Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" and import your repo
4. Add environment variables in Settings
5. Click "Deploy"

### Other Platforms

See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions on:
- Railway
- Heroku
- DigitalOcean
- Self-hosted VPS

## 🐛 Troubleshooting

**Commands not showing up?**
- Wait 5-10 minutes for Discord to sync
- Remove and re-invite the bot
- Verify the bot has `applications.commands` scope

**Bot not responding?**
- Check Vercel logs for errors
- Verify environment variables are set correctly
- Check that Interactions Endpoint URL is verified

**Can't hear music?**
- Verify the bot has "Speak" and "Connect" permissions in the voice channel.
- Ensure the server has a stable internet connection for downloading/streaming.
- Check the console logs for any errors relating to the `yt-dlp` extractor.

## 📚 Learn More

- [Discord.js Documentation](https://discord.js.org)
- [Discord Developer Portal](https://discord.com/developers)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💬 Support

For help and questions:
1. Check the documentation files
2. Review the troubleshooting section
3. Check Vercel logs
4. Create an issue on GitHub

## 🎉 Enjoy!

Your Discord music bot is ready to go! 🎵

---

**Made with ❤️ for music lovers**

[Go to Setup](./app/setup/page.tsx) | [Read Docs](./QUICK_START.md) | [Visit Home](./app/page.tsx)
