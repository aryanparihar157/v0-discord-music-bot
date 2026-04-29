import { NextRequest, NextResponse } from 'next/server';

const DISCORD_API_URL = 'https://discord.com/api/v10';
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const TOKEN = process.env.DISCORD_TOKEN;

const commands = [
  {
    name: 'play',
    description: 'Play a song by name, YouTube link, or Spotify link',
    options: [
      {
        name: 'query',
        description: 'Song name, YouTube URL, or Spotify URL',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'pause',
    description: 'Pause the currently playing song',
  },
  {
    name: 'resume',
    description: 'Resume the paused song',
  },
  {
    name: 'skip',
    description: 'Skip to the next song in queue',
  },
  {
    name: 'stop',
    description: 'Stop playback and clear the queue',
  },
  {
    name: 'queue',
    description: 'Show the current music queue',
    options: [
      {
        name: 'page',
        description: 'Queue page number (default: 1)',
        type: 4,
        required: false,
      },
    ],
  },
  {
    name: 'volume',
    description: 'Set the bot volume (0-200%)',
    options: [
      {
        name: 'level',
        description: 'Volume level 0-200',
        type: 4,
        required: true,
        min_value: 0,
        max_value: 200,
      },
    ],
  },
  {
    name: 'nowplaying',
    description: 'Show the currently playing song',
  },
  {
    name: 'shuffle',
    description: 'Shuffle the music queue',
  },
  {
    name: 'clearqueue',
    description: 'Clear all songs from the queue',
  },
  {
    name: 'help',
    description: 'Show all available commands and their usage',
  },
  {
    name: 'botinfo',
    description: 'Show bot information and statistics',
  },
];

export async function POST(request: NextRequest) {
  try {
    if (!CLIENT_ID || !TOKEN) {
      return NextResponse.json(
        { error: 'Missing DISCORD_CLIENT_ID or DISCORD_TOKEN' },
        { status: 400 }
      );
    }


    const response = await fetch(
      `${DISCORD_API_URL}/applications/${CLIENT_ID}/commands`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bot ${TOKEN}`,
        },
        body: JSON.stringify(commands),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('[v0] Error registering commands:', error);
      return NextResponse.json(
        { error: 'Failed to register commands', details: error },
        { status: 400 }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      {
        success: true,
        message: `Registered ${data.length} commands`,
        commands: data.map((cmd: any) => cmd.name),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Command registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
