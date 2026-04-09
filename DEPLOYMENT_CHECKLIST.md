# Discord Music Bot - Deployment Checklist

Follow this checklist to deploy your bot successfully.

## ✅ Pre-Deployment

- [ ] You have a GitHub account
- [ ] Your code is pushed to a GitHub repository
- [ ] You have a Vercel account (sign up at vercel.com)

## ✅ Discord Setup

### Create Application
- [ ] Go to [Discord Developer Portal](https://discord.com/developers/applications)
- [ ] Click "New Application"
- [ ] Give your bot a name
- [ ] Agree to terms and create

### Configure Bot
- [ ] Go to "Bot" tab
- [ ] Click "Add Bot"
- [ ] Under "TOKEN", click "Copy"
- [ ] Save this value as `DISCORD_TOKEN` ✱

### Get IDs
- [ ] Go to "General Information" tab
- [ ] Copy "CLIENT ID" and save as `DISCORD_CLIENT_ID` ✱
- [ ] Copy "PUBLIC KEY" and save as `DISCORD_PUBLIC_KEY` ✱

### Set Permissions
- [ ] In Bot tab, go to "MESSAGE CONTENT INTENT"
- [ ] Toggle ON ✅
- [ ] Save changes

## ✅ Vercel Deployment

### Connect Repository
- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Click "New Project"
- [ ] Select your GitHub repository
- [ ] Click "Import"

### Add Environment Variables
- [ ] In "Environment Variables" section, add:
  - [ ] `DISCORD_TOKEN` = your copied token
  - [ ] `DISCORD_CLIENT_ID` = your copied client ID
  - [ ] `DISCORD_PUBLIC_KEY` = your copied public key
  - [ ] (Optional) `SPOTIFY_CLIENT_ID` = spotify ID
  - [ ] (Optional) `SPOTIFY_CLIENT_SECRET` = spotify secret

### Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete (usually 2-3 minutes)
- [ ] Your site is now live at `https://<your-project>.vercel.app`

## ✅ Discord Configuration (Post-Deployment)

### Set Interactions Endpoint
- [ ] Go back to [Discord Developer Portal](https://discord.com/developers/applications)
- [ ] Select your application
- [ ] Go to "General Information"
- [ ] Find "Interactions Endpoint URL"
- [ ] Set it to: `https://<your-vercel-url>/api/discord/interactions`
- [ ] Click "Save Changes"
- [ ] Wait for verification ✅

### Verify Integration
- [ ] You should see a green checkmark next to Interactions Endpoint URL
- [ ] If you see an error, check:
  - [ ] URL is correct
  - [ ] Environment variables are properly set
  - [ ] Vercel deployment is complete

## ✅ Invite Bot to Server

### Generate Invite Link
- [ ] Visit: `https://<your-vercel-url>/setup`
- [ ] You'll see the invite button or link
- [ ] OR manually construct: `https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=36700160&scope=bot%20applications.commands`

### Add to Server
- [ ] Click the invite link
- [ ] Select a server from the dropdown
- [ ] Click "Authorize"
- [ ] Grant permissions when prompted
- [ ] Complete CAPTCHA if required

## ✅ Test Bot

### Check Commands
- [ ] Go to your Discord server
- [ ] Type `/` in any channel
- [ ] You should see bot commands appearing:
  - [ ] `/play`
  - [ ] `/pause`
  - [ ] `/resume`
  - [ ] `/skip`
  - [ ] `/stop`
  - [ ] `/queue`
  - [ ] `/volume`
  - [ ] `/shuffle`
  - [ ] `/help`

### Test Functionality
- [ ] Join a voice channel
- [ ] Use `/play Imagine John Lennon` to test
- [ ] Bot should respond with song info
- [ ] Try `/help` to see all commands

## 🐛 Troubleshooting

### Commands Not Showing
**Problem**: Typing `/` doesn't show commands
**Solution**:
- [ ] Verify bot has `applications.commands` scope (it should if you used the invite link)
- [ ] Wait 5-10 minutes and try again
- [ ] Remove and re-invite the bot

### Bot Not Responding
**Problem**: Commands appear but bot doesn't respond
**Solution**:
- [ ] Check Vercel logs: Dashboard → Project → Deployments → Logs
- [ ] Verify Interactions Endpoint URL is set and verified (green checkmark)
- [ ] Check all 3 environment variables are set correctly
- [ ] Check Recent Logs tab for errors

### Interactions Endpoint URL Error
**Problem**: "Interaction endpoint URL unable to be verified"
**Solution**:
- [ ] Check URL matches: `https://your-domain.vercel.app/api/discord/interactions`
- [ ] Ensure Vercel deployment is complete (not deploying)
- [ ] Check environment variables are set
- [ ] Try removing and re-adding the URL

### Bot Can't Connect to Voice
**Problem**: Bot doesn't join voice channels
**Solution**:
- [ ] Current version is text-based only (voice coming soon)
- [ ] Commands will respond in text even without voice channel

## 📊 Monitoring

### Check Logs
- [ ] Go to Vercel Dashboard → Project → Deployments
- [ ] Click on the latest deployment
- [ ] Go to "Logs" to see errors
- [ ] Check timestamps when commands are failing

### Monitor Errors
- [ ] Watch for DISCORD_TOKEN errors (env var not set)
- [ ] Watch for "endpoint not verified" messages
- [ ] Check for API rate limiting

## 🔄 Making Changes

If you need to update your bot:

1. [ ] Make changes to your code
2. [ ] Push to GitHub
3. [ ] Vercel automatically redeploys
4. [ ] Wait 2-3 minutes for deployment
5. [ ] Test commands again

## 📝 Additional Notes

- Vercel provides **12 GB/month free bandwidth**
- Your bot will run **24/7** as long as your Vercel account is active
- Slash commands are **registered globally** and available everywhere
- Bot responds to commands **via HTTP** (no persistent connection needed)

---

## ✨ You're All Set!

Your Discord music bot is now live and ready to use. Enjoy! 🎵

If you encounter issues:
1. Check this checklist again
2. Read error messages in Vercel logs carefully
3. Verify all environment variables are set
4. Make sure the Interactions Endpoint URL is verified
