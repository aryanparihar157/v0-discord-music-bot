'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Music, Zap, Headphones, Radio } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <Music className="w-6 h-6 text-blue-400" />
            Discord Music Bot
          </div>
          <div className="flex gap-3">
            <Link href="/setup">
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                Setup Bot
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Play Music in Discord
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            A powerful music bot that plays songs from YouTube, Spotify, Apple Music, and more.
            Deploy in minutes with Vercel.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/setup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg">
                Get Started
              </Button>
            </Link>
            <Link href="https://discord.com/developers/applications" target="_blank">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 text-lg rounded-lg">
                Developer Portal
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {[
            {
              icon: Radio,
              title: 'Multiple Sources',
              description: 'YouTube, Spotify, Apple Music, and more',
            },
            {
              icon: Zap,
              title: 'Fast Deployment',
              description: 'Deploy to Vercel in just a few minutes',
            },
            {
              icon: Headphones,
              title: 'Easy Commands',
              description: 'Simple slash commands for all operations',
            },
            {
              icon: Music,
              title: 'Queue Management',
              description: 'Full queue support with shuffle and skip',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-lg border border-slate-700 bg-slate-900/50 hover:bg-slate-900 transition"
              >
                <Icon className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Steps */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Quick Setup</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Create Bot',
                description: 'Go to Discord Developer Portal and create a new bot application',
              },
              {
                step: '2',
                title: 'Get Credentials',
                description: 'Copy your token, client ID, and public key from the portal',
              },
              {
                step: '3',
                title: 'Deploy & Invite',
                description: 'Deploy to Vercel, set environment variables, and invite to your server',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-blue-400/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Commands Preview */}
        <section className="mb-20 p-8 rounded-lg border border-slate-700 bg-slate-900/50">
          <h2 className="text-2xl font-bold text-white mb-6">Available Commands</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { cmd: '/play', desc: 'Play a song by name or link' },
              { cmd: '/pause', desc: 'Pause playback' },
              { cmd: '/resume', desc: 'Resume playback' },
              { cmd: '/skip', desc: 'Skip to next song' },
              { cmd: '/stop', desc: 'Stop and clear queue' },
              { cmd: '/queue', desc: 'View the queue' },
              { cmd: '/volume', desc: 'Adjust volume' },
              { cmd: '/shuffle', desc: 'Shuffle queue' },
            ].map((cmd, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="font-mono text-blue-400 font-semibold whitespace-nowrap">{cmd.cmd}</span>
                <span className="text-slate-400">{cmd.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12 rounded-lg border border-blue-500/30 bg-blue-500/5">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-slate-400 mb-8 text-lg">
            Follow the setup guide to deploy your music bot in minutes
          </p>
          <Link href="/setup">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg">
              Go to Setup Guide
            </Button>
          </Link>
        </section>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Discord Music Bot • Built with Next.js, Discord.js, and Vercel</p>
          <p className="mt-2">
            Made with <span className="text-red-400">❤</span> for music lovers
          </p>
        </div>
      </footer>
    </main>
  );
}
