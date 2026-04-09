'use client';

import { useState, useEffect } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DiscordBotSetup() {
  const [copied, setCopied] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState('');

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '';

  useEffect(() => {
    if (clientId) {
      const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=36700160&scope=bot%20applications.commands`;
      setInviteUrl(url);
    } else {
      // Fallback if env var not set
      setInviteUrl('https://discord.com/developers/applications');
    }
  }, [clientId]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const steps = [
    {
      number: 1,
      title: 'Create Discord Application',
      description: 'Go to Discord Developer Portal and create a new application',
      link: 'https://discord.com/developers/applications',
      linkText: 'Open Developer Portal',
    },
    {
      number: 2,
      title: 'Create Bot User',
      description: 'Go to the "Bot" section and click "Add Bot"',
      details: 'This creates a bot user for your application.',
    },
    {
      number: 3,
      title: 'Get Your Token',
      description: 'Copy your bot token from the "TOKEN" section',
      details: 'Keep this secret! Add it as DISCORD_TOKEN in your environment variables.',
    },
    {
      number: 4,
      title: 'Get Your Client ID',
      description: 'Copy your Client ID from the "General Information" tab',
      details: 'Add it as DISCORD_CLIENT_ID in your environment variables.',
    },
    {
      number: 5,
      title: 'Get Your Public Key',
      description: 'Copy your Public Key from the "General Information" tab',
      details: 'Add it as DISCORD_PUBLIC_KEY in your environment variables.',
    },
    {
      number: 6,
      title: 'Enable Required Intents',
      description: 'In the Bot tab, enable: Message Content Intent',
      details: 'This allows the bot to read message content.',
    },
    {
      number: 7,
      title: 'Set Interaction Endpoint URL',
      description: 'In the General Information tab, set the Interactions Endpoint URL',
      details: 'This should be your deployed URL with /api/discord/interactions appended.',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Discord Music Bot Setup</h1>
          <p className="text-slate-400">Deploy your music bot in minutes</p>
        </div>

        {/* Invite Section */}
        {inviteUrl && (
          <Card className="mb-8 border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-green-400">Invite Bot to Server</CardTitle>
              <CardDescription>Click the button below to invite the bot to your Discord server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg">
                  Invite Bot to Server
                </Button>
              </a>
              <div className="mt-4 p-4 bg-slate-800 rounded border border-slate-700 break-all">
                <p className="text-xs text-slate-400 mb-2">Invite URL:</p>
                <p className="text-sm font-mono">{inviteUrl}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Setup Steps */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Setup Steps</h2>
          {steps.map((step) => (
            <Card key={step.number} className="border-slate-700">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              {(step.details || step.link) && (
                <CardContent>
                  {step.details && <p className="text-sm text-slate-400 mb-3">{step.details}</p>}
                  {step.link && (
                    <a href={step.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="text-blue-400 border-blue-400 hover:bg-blue-400/10">
                        {step.linkText} →
                      </Button>
                    </a>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Environment Variables Section */}
        <Card className="mt-8 border-slate-700">
          <CardHeader>
            <CardTitle>Environment Variables Required</CardTitle>
            <CardDescription>Add these to your Vercel project settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { key: 'DISCORD_TOKEN', value: 'Your bot token from Discord Developer Portal', required: true },
                { key: 'DISCORD_CLIENT_ID', value: 'Your application Client ID', required: true },
                { key: 'DISCORD_PUBLIC_KEY', value: 'Your application Public Key', required: true },
                { key: 'SPOTIFY_CLIENT_ID', value: 'Optional: For Spotify search', required: false },
                { key: 'SPOTIFY_CLIENT_SECRET', value: 'Optional: For Spotify search', required: false },
              ].map((env) => (
                <div
                  key={env.key}
                  className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700 hover:border-slate-600 transition"
                >
                  <div className="flex-1">
                    <p className="font-mono text-sm font-semibold text-slate-200">{env.key}</p>
                    <p className="text-xs text-slate-400 mt-1">{env.value}</p>
                    {env.required && <p className="text-xs text-red-400 mt-1">Required ✱</p>}
                  </div>
                  <button
                    onClick={() => copyToClipboard(env.key, env.key)}
                    className="p-2 hover:bg-slate-700 rounded transition"
                  >
                    {copied === env.key ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Commands Preview */}
        <Card className="mt-8 border-slate-700">
          <CardHeader>
            <CardTitle>Available Commands</CardTitle>
            <CardDescription>Use these slash commands in Discord</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { cmd: '/play <song>', desc: 'Play a song by name or link' },
                { cmd: '/pause', desc: 'Pause playback' },
                { cmd: '/resume', desc: 'Resume playback' },
                { cmd: '/skip', desc: 'Skip to next song' },
                { cmd: '/stop', desc: 'Stop and clear queue' },
                { cmd: '/queue', desc: 'View the queue' },
                { cmd: '/volume <0-200>', desc: 'Set volume level' },
                { cmd: '/nowplaying', desc: 'Show current song' },
                { cmd: '/shuffle', desc: 'Shuffle queue' },
                { cmd: '/clearqueue', desc: 'Clear all songs' },
              ].map((cmd, i) => (
                <div key={i} className="p-3 bg-slate-800 rounded border border-slate-700">
                  <p className="font-mono text-sm font-semibold text-blue-400">{cmd.cmd}</p>
                  <p className="text-xs text-slate-400 mt-1">{cmd.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mt-8 border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle>After Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm text-slate-300">
              <li>✅ Set your environment variables in Vercel Settings → Vars</li>
              <li>✅ Deploy your Next.js project to Vercel</li>
              <li>✅ Set the Interactions Endpoint URL to: <code className="bg-slate-900 px-2 py-1 rounded text-xs">https://yourdomain.com/api/discord/interactions</code></li>
              <li>✅ Invite the bot using the link above</li>
              <li>✅ Use slash commands in any channel!</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
