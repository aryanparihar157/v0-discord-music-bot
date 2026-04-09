# Deployment Guide - Discord Music Bot

This guide covers deploying your Discord music bot to various platforms.

## Table of Contents

1. [Quick Start (Local Development)](#quick-start)
2. [Vercel Deployment](#vercel-deployment)
3. [Self-Hosted (VPS/Server)](#self-hosted)
4. [Heroku Deployment](#heroku-deployment)
5. [Railway.app Deployment](#railwayapp)
6. [Troubleshooting](#troubleshooting)

## Quick Start

### Local Development

1. **Clone/Setup Project**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env.local`
   - Fill in your Discord bot token and client ID
   - Optionally add Spotify credentials

3. **Deploy Commands**
   ```bash
   npm run deploy-commands
   ```

4. **Start the Bot**

   **Option A: As API via development server**
   ```bash
   npm run dev
   # Then call POST /api/bot/start
   ```

   **Option B: Standalone bot process**
   ```bash
   npm run bot:start
   ```

## Vercel Deployment

Vercel is ideal for running the bot as a serverless function via the `/api/bot/start` endpoint.

### Setup

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env.example`:
     - `DISCORD_TOKEN`
     - `DISCORD_CLIENT_ID`
     - `DISCORD_GUILD_ID` (optional)
     - `SPOTIFY_CLIENT_ID` (optional)
     - `SPOTIFY_CLIENT_SECRET` (optional)

4. **Deploy**
   - Vercel will automatically deploy on push to main
   - Bot will start when you call `/api/bot/start`

5. **Keep Bot Running**
   - Use a cron service to call `/api/bot/start` periodically
   - Or call the endpoint from your Discord server's bot management dashboard

### Vercel Alternative: Use External Hosting for Bot Process

For continuous bot running, host the bot process separately:

```bash
npm run bot:start
```

And use Vercel only for the web dashboard.

## Self-Hosted (VPS/Server)

### Prerequisites

- VPS or Server (DigitalOcean, Linode, AWS EC2, etc.)
- Node.js 16+ installed
- Git installed

### Setup

1. **SSH into your server**
   ```bash
   ssh root@your_server_ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Configure Environment**
   ```bash
   nano .env.local
   # Or use your preferred editor
   ```
   - Add all required environment variables from `.env.example`

6. **Deploy Commands**
   ```bash
   npm run deploy-commands
   ```

7. **Start Bot with PM2 (Recommended)**
   ```bash
   # Install PM2
   npm install -g pm2

   # Start bot
   pm2 start "npm run bot:start" --name "discord-music-bot"

   # Save configuration
   pm2 save

   # Enable auto-start on reboot
   pm2 startup
   ```

8. **Monitor Bot**
   ```bash
   pm2 logs discord-music-bot
   pm2 status
   ```

### Update Bot

```bash
cd your-repo
git pull
npm install
pm2 restart discord-music-bot
```

## Heroku Deployment

### Prerequisites

- Heroku account
- Heroku CLI installed
- GitHub connected

### Setup

1. **Create Heroku App**
   ```bash
   heroku login
   heroku create your-app-name
   ```

2. **Add Heroku Git Remote**
   ```bash
   heroku git:remote -a your-app-name
   ```

3. **Configure Environment Variables**
   ```bash
   heroku config:set DISCORD_TOKEN=your_token
   heroku config:set DISCORD_CLIENT_ID=your_client_id
   ```

4. **Create Procfile**
   ```bash
   echo "worker: npm run bot:start" > Procfile
   git add Procfile
   git commit -m "Add Procfile"
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Enable Dyno**
   ```bash
   heroku ps:scale worker=1
   ```

7. **Monitor**
   ```bash
   heroku logs --tail
   ```

## Railway.app

Railway is another great option for 24/7 bot hosting.

### Setup

1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "Deploy on Railway" or "New Project"
   - Select GitHub repository

2. **Configure Environment**
   - In Railway project settings
   - Add environment variables from `.env.example`

3. **Add Startup Command**
   - Variables → `NPM_INSTALL=1`
   - Variables → `START_CMD=npm run bot:start`

4. **Deploy**
   - Railway automatically deploys on GitHub push
   - Provides logs and monitoring dashboard

## Troubleshooting

### Bot Not Responding

1. Check bot token is correct
   ```bash
   npm run deploy-commands
   ```

2. Verify bot is logged in
   - Check logs for "Bot logged in as..."
   - Check bot status in Discord server (should be online)

3. Check permissions
   - Server → Server Settings → Roles
   - Ensure bot role has Message permissions

### Slash Commands Not Showing

1. Redeploy commands
   ```bash
   npm run deploy-commands
   ```

2. Refresh Discord
   - Type `/` in chat
   - Wait for commands to load
   - Restart Discord app if needed

### Audio Not Playing

1. Ensure `play-dl` is installed
   ```bash
   npm list play-dl
   ```

2. Check bot voice permissions
   - Channel Settings → Permissions
   - Bot role: Connect ✓, Speak ✓

3. Check system audio
   - Verify server has ffmpeg installed
   - For Heroku, use buildpack: `heroku/nodejs` and `https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git`

### High Memory Usage

1. Limit queue size in code
   - Set max queue songs
   - Clear finished songs from cache

2. Upgrade server resources
   - Add more RAM/CPU if needed

3. Monitor with PM2
   ```bash
   pm2 monit
   ```

### Connection Drops

1. Add reconnection logic
   - Already included in discord.js
   - Check logs for connection errors

2. Increase timeout values
   - Edit bot/index.ts if needed

## Performance Tips

1. **Limit Queue**
   - Set maximum queue size to prevent memory issues
   - Clear old songs periodically

2. **Cache Results**
   - Cache Spotify search results
   - Reduce API calls

3. **Use Cron Jobs**
   - Keep bot alive with periodic API calls
   - Prevent Heroku dyno sleep

4. **Monitor Resources**
   - Use PM2 for monitoring
   - Check CPU and memory usage regularly

## Support

- Discord.js Docs: https://discord.js.org
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Heroku Docs: https://devcenter.heroku.com
