'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BotDashboard() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'running' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const startBot = async () => {
    setStatus('loading');
    setMessage('Starting bot...');
    
    try {
      const response = await fetch('/api/bot/start', { method: 'POST' });
      const data = await response.json();
      
      if (response.ok) {
        setStatus('running');
        setMessage('Bot is now running! Use the Discord slash commands in your server.');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to start bot');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error connecting to bot API');
    }
  };

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/bot/start', { method: 'GET' });
      const data = await response.json();
      
      if (data.status === 'running') {
        setStatus('running');
        setMessage('Bot is running');
      } else {
        setStatus('idle');
        setMessage('Bot is not running');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to check bot status');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discord Music Bot</h1>
          <p className="text-gray-600">Manage your bot and play music in Discord</p>
        </div>

        {/* Status Alert */}
        {message && (
          <Alert className={`mb-6 ${
            status === 'error' ? 'border-red-200 bg-red-50' :
            status === 'running' ? 'border-green-200 bg-green-50' :
            'border-blue-200 bg-blue-50'
          }`}>
            <AlertDescription className={
              status === 'error' ? 'text-red-700' :
              status === 'running' ? 'text-green-700' :
              'text-blue-700'
            }>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Bot Control Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bot Control</CardTitle>
            <CardDescription>Start, stop, and manage your Discord bot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button 
                onClick={startBot}
                disabled={status === 'loading'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {status === 'loading' ? 'Starting...' : 'Start Bot'}
              </Button>
              <Button 
                onClick={checkStatus}
                variant="outline"
              >
                Check Status
              </Button>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Current Status:</p>
              <p className={`text-lg font-semibold ${
                status === 'running' ? 'text-green-600' :
                status === 'error' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {status === 'idle' && '⭕ Idle'}
                {status === 'loading' && '🔄 Loading...'}
                {status === 'running' && '🟢 Running'}
                {status === 'error' && '🔴 Error'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Commands Reference Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Available Commands</CardTitle>
            <CardDescription>Use these slash commands in Discord</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-gray-900">/play</p>
                <p className="text-sm text-gray-600">Play a song by name, YouTube link, Spotify link, or Apple Music link</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-gray-900">/queue</p>
                <p className="text-sm text-gray-600">View the current music queue and playback status</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-gray-900">/pause</p>
                <p className="text-sm text-gray-600">Pause the currently playing song</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-gray-900">/resume</p>
                <p className="text-sm text-gray-600">Resume playback of a paused song</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-gray-900">/skip</p>
                <p className="text-sm text-gray-600">Skip the current song and play the next one</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-gray-900">/stop</p>
                <p className="text-sm text-gray-600">Stop playback and clear the queue</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-gray-900">/volume</p>
                <p className="text-sm text-gray-600">Set the playback volume (0-200%)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>Follow these steps to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-semibold text-blue-600">1.</span>
                <span>Set your <code className="bg-gray-100 px-2 py-1 rounded">DISCORD_TOKEN</code> in environment variables</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-blue-600">2.</span>
                <span>Run <code className="bg-gray-100 px-2 py-1 rounded">npm run deploy-commands</code> to register slash commands</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-blue-600">3.</span>
                <span>Click the "Start Bot" button above or run <code className="bg-gray-100 px-2 py-1 rounded">npm run bot:start</code></span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-blue-600">4.</span>
                <span>Open Discord and try a slash command like <code className="bg-gray-100 px-2 py-1 rounded">/play</code></span>
              </li>
            </ol>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800 mb-2">📋 Need help?</p>
              <p className="text-sm text-yellow-700">Check the <code className="bg-yellow-100 px-2 py-1 rounded">BOT_SETUP.md</code> file for detailed setup instructions and troubleshooting.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
