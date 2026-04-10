# Deploy Discord Music Bot - Final Steps

## ✅ Everything is Ready!

Your Discord music bot is fully built and configured. Follow these steps to deploy:

---

## Step 1: Publish to Vercel (1 minute)

1. Click the **"Publish"** button in the top right of v0
2. Wait for the deployment to complete
3. Copy your deployment URL (e.g., `https://my-bot.vercel.app`)

---

## Step 2: Set Discord Webhook (2 minutes)

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Click **General Information** tab
4. Find **"Interactions Endpoint URL"** field
5. Paste: `https://YOUR-VERCEL-URL.vercel.app/api/discord/interactions`
6. Click **Save Changes**

> **Note:** Discord will verify the endpoint is working. If it fails, go back and check:
> - Make sure your URL is correct (no trailing slash)
> - Verify `DISCORD_PUBLIC_KEY` is set in Vercel
> - Check that your deployment is live

---

## Step 3: Register Slash Commands (1 minute)

Visit: `https://YOUR-VERCEL-URL.vercel.app/setup`

Click the **"Register Commands"** button and wait for the success message. This registers all your bot's commands with Discord.

---

## Step 4: Invite Bot to Server (30 seconds)

On the same setup page, click the **"Invite Bot to Server"** button, or visit:
```
https://discord.com/api/oauth2/authorize?client_id=241f8338e06d04bf74c294c0ee9b9cb476d985d2ff6643b326a7f3cb93d4fe3f&permissions=36700160&scope=bot%20applications.commands
```

Select your Discord server and authorize.

---

## Step 5: Test in Discord (1 minute)

1. Go to your Discord server
2. Type `/` and you should see bot commands
3. Try `/play cute cat videos` or `/help`
4. Bot should respond instantly!

---

## 🎉 You're Done!

Your bot is now live 24/7 on Vercel. Every time you use a slash command:
- Discord sends a request to your Vercel URL
- The bot processes and responds instantly
- All music streaming is handled by the bot

---

## Troubleshooting

### "Interactions Endpoint Failed to Validate"
- Check your URL is exactly: `https://YOUR-URL.vercel.app/api/discord/interactions` (no trailing slash)
- Verify `DISCORD_PUBLIC_KEY` is correctly set in Vercel Vars
- Wait 30 seconds and try again

### "Commands Not Showing"
- Click "Register Commands" button on setup page
- Check the setup page shows success message
- Refresh your Discord client

### "Bot Not Responding"
- Check bot permissions in your server settings
- Verify bot has "Send Messages" and "Embed Links" permissions
- Try `/help` command first

---

## Environment Variables Checklist

Make sure these are set in Vercel project settings (Settings → Vars):

- ✅ `DISCORD_TOKEN` - Your bot token
- ✅ `DISCORD_CLIENT_ID` - Your application ID
- ✅ `DISCORD_PUBLIC_KEY` - Your public key (you added this)
- ⚠️ `SPOTIFY_CLIENT_ID` - Optional (for Spotify search)
- ⚠️ `SPOTIFY_CLIENT_SECRET` - Optional (for Spotify search)

---

## Bot Commands

Once deployed, these commands are available:

| Command | Usage | Description |
|---------|-------|-------------|
| `/play` | `/play song name` | Play a song by name, YouTube link, or Spotify link |
| `/pause` | `/pause` | Pause current song |
| `/resume` | `/resume` | Resume paused song |
| `/skip` | `/skip` | Skip to next song |
| `/stop` | `/stop` | Stop and clear queue |
| `/queue` | `/queue [page]` | View music queue |
| `/volume` | `/volume 50` | Set volume (0-200) |
| `/nowplaying` | `/nowplaying` | Show current song |
| `/shuffle` | `/shuffle` | Shuffle queue |
| `/clearqueue` | `/clearqueue` | Clear all songs |
| `/help` | `/help` | Show all commands |
| `/botinfo` | `/botinfo` | Show bot info |

---

## Next Steps

After deployment, you can:
- Customize bot name and avatar in Discord Developer Portal
- Set a status in the bot's code
- Add more music sources
- Customize responses and embeds
- Monitor usage and errors in Vercel logs

Your bot is ready! 🎵
