# Discord Music Bot - Quick Start Guide

Deploy your Discord music bot to Vercel and start playing music in minutes!

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your Discord Credentials

1. **Go to [Discord Developer Portal](https://discord.com/developers/applications)**
2. **Click "New Application"** and give it a name
3. **Go to the "Bot" tab** and click "Add Bot"
4. **Copy these values** (you'll need them):
   - **TOKEN** - Your bot's secret token
   - Go back to **General Information** tab and copy:
   - **CLIENT ID** - Your application's ID
   - **PUBLIC KEY** - Your public key

### Step 2: Enable Required Intents

1. Still in the **Bot** tab
2. Turn on: **Message Content Intent**
3. Save changes

### Step 3: Deploy to Vercel

#### Option A: One-Click Deploy
Click the button below to deploy directly to Vercel:

```
[Deploy Button Coming Soon - For now, use Option B]
```

#### Option B: Manual Deployment

1. **Push your code to GitHub** (if not already)
2. **Go to [Vercel](https://vercel.com)** and sign in
3. **Click "New Project"** and select your repository
4. **Add Environment Variables** in Project Settings → Environment Variables:
   - `DISCORD_TOKEN` = Your bot token
   - `DISCORD_CLIENT_ID` = Your client ID
   - `DISCORD_PUBLIC_KEY` = Your public key
5. **Click Deploy**

### Step 4: Set Interactions Endpoint URL

1. Go back to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to **General Information**
4. Scroll to **Interactions Endpoint URL**
5. Enter: `https://your-vercel-domain.vercel.app/api/discord/interactions`
6. Click Save Changes

### Step 5: Invite Bot to Your Server

Visit: `https://your-vercel-domain.vercel.app/setup`

This page will show you the invite link. Click it to add the bot to your server!

Alternatively, use this URL format:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=36700160&scope=bot%20applications.commands
```

Replace `YOUR_CLIENT_ID` with your actual Client ID.

## 💿 Commands

Use these slash commands in Discord:

| Command | Description |
|---------|-------------|
| `/play <song>` | Play a song by name, YouTube link, or Spotify URL |
| `/pause` | Pause the current song |
| `/resume` | Resume playback |
| `/skip` | Skip to the next song |
| `/stop` | Stop playback and clear the queue |
| `/queue` | View the music queue |
| `/nowplaying` | Show the currently playing song |
| `/volume <0-200>` | Set volume (0-200%) |
| `/shuffle` | Shuffle the queue |
| `/clearqueue` | Clear all songs from the queue |
| `/help` | Show all commands |

## 🔧 Environment Variables

Required:
- `DISCORD_TOKEN` - Your bot's authentication token
- `DISCORD_CLIENT_ID` - Your application's Client ID
- `DISCORD_PUBLIC_KEY` - Your application's Public Key

Optional (for Spotify search):
- `SPOTIFY_CLIENT_ID` - Spotify API Client ID
- `SPOTIFY_CLIENT_SECRET` - Spotify API Client Secret

## 📁 Project Structure

```
bot/
├── handlers/
│   └── slashCommandHandler.ts    # Handles slash commands
├── commands/
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
├── utils/
│   ├── musicSearch.ts            # Search for songs
│   ├── musicState.ts             # Manage playback state
│   ├── streaming.ts              # Audio streaming
│   └── queueManager.ts           # Queue utilities
└── types.d.ts                    # TypeScript types

app/
├── api/
│   └── discord/
│       └── interactions/
│           └── route.ts          # Discord webhook endpoint
├── setup/
│   └── page.tsx                  # Bot invitation page
└── bot/
    └── page.tsx                  # Bot control dashboard
```

## 🎵 Music Sources Supported

- **YouTube** - Play any YouTube video
- **Spotify** - Search and play Spotify tracks
- **Apple Music** - Support for Apple Music links
- **Direct Links** - Play audio from any direct URL
- **Song Names** - Search by song title and artist

## 🐛 Troubleshooting

### Bot not responding to commands
- Make sure the **Interactions Endpoint URL** is set correctly
- Check that environment variables are properly set in Vercel
- Verify the bot has been added to your server

### Commands not showing up
- Wait a few minutes for Discord to sync the commands
- Try typing `/` in your server to see if commands appear
- If not, the bot may not have been properly invited with `applications.commands` scope

### Music not playing
- Make sure the bot has permission to connect and speak in voice channels
- Check that you're in a voice channel before using `/play`
- Verify the song/link is accessible

## 📚 Additional Resources

- [Discord.js Documentation](https://discord.js.org)
- [Discord Developer Portal](https://discord.com/developers)
- [Vercel Documentation](https://vercel.com/docs)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions, check the documentation files in the project or create an issue on GitHub.

---

**Happy music streaming! 🎵**
