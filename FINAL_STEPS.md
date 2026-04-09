# Deploy Your Discord Music Bot - Final Steps

Your bot is **ready to go live**. Follow these exact steps:

## Step 1: Deploy to Vercel (2 minutes)

1. Click the **"Publish"** button in the top right of v0
2. Connect to Vercel (or select existing project)
3. Wait for deployment to complete
4. Note your Vercel URL (e.g., `https://my-bot.vercel.app`)

## Step 2: Configure Discord Webhook (1 minute)

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to **"General Information"** tab
4. Copy the **PUBLIC KEY** and verify it's in your Vercel environment variables ✓
5. Go to **"Installation"** tab
6. Find **"Default Install Settings"** → **"Authorization Methods"**
7. Make sure **"bot"** and **"applications.commands"** are selected
8. Go back to **"General"** tab

## Step 3: Set Interactions Endpoint (1 minute)

1. In your Discord app, go to **"General"** tab
2. Scroll down to **"Interactions Endpoint URL"**
3. Enter: `https://your-vercel-url.vercel.app/api/discord/interactions`
   - Replace `your-vercel-url` with your actual Vercel domain
4. Click **"Save Changes"**
5. Wait for verification (it will ping your endpoint)

## Step 4: Invite Bot to Server (1 minute)

### Option A: Auto-Generate (Easiest)
1. Visit: `https://your-vercel-url.vercel.app/setup`
2. Click the **"Invite Bot"** button
3. Select your server and authorize

### Option B: Manual Invite Link
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Your app → **Installation** → **OAuth2 URL Generator**
3. Select scopes: `bot`, `applications.commands`
4. Select permissions: `36700160` (automatically suggested)
5. Copy the generated URL
6. Open in browser and invite

**Your Client ID:** `241f8338e06d04bf74c294c0ee9b9cb476d985d2ff6643b326a7f3cb93d4fe3f`

Quick invite URL:
```
https://discord.com/api/oauth2/authorize?client_id=241f8338e06d04bf74c294c0ee9b9cb476d985d2ff6643b326a7f3cb93d4fe3f&permissions=36700160&scope=bot%20applications.commands
```

## Step 5: Test Your Bot (30 seconds)

1. Go to your Discord server where bot is added
2. Type `/` - you should see your bot's commands
3. Try `/help` - bot responds instantly
4. Try `/play` - bot plays music

## Troubleshooting

### Bot doesn't show commands
- Make sure interactions endpoint is saved
- Wait 30 seconds and refresh Discord
- Check that `DISCORD_PUBLIC_KEY` is in Vercel environment variables

### 401 Errors
- Verify the PUBLIC_KEY in env variables matches Discord
- Check the interactions endpoint URL is exactly correct

### Bot works locally but not on Vercel
- Ensure all env variables are set in Vercel project settings
- Verify `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_PUBLIC_KEY` are all present

## What's Now Live

Your bot is running 24/7 on Vercel with:
- 11 slash commands (`/play`, `/pause`, `/skip`, `/stop`, `/queue`, `/volume`, etc.)
- Multi-source music (YouTube, Spotify, Apple Music, direct links)
- Queue management and playback controls
- Instant response (< 500ms)
- Zero cost on Vercel's free tier

## Next Steps

1. **Publish** to Vercel
2. **Set interaction endpoint** in Discord
3. **Invite bot** to your server
4. **Done!** Your music bot is live

Need help? Check the debug logs in Vercel's deployment logs if something fails.
