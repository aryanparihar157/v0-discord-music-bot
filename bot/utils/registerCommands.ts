import fetch from 'node-fetch';

const DISCORD_API_URL = 'https://discord.com/api/v10';
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const TOKEN = process.env.DISCORD_TOKEN;

if (!CLIENT_ID || !TOKEN) {
  console.error('[v0] Missing DISCORD_CLIENT_ID or DISCORD_TOKEN');
  process.exit(1);
}

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

async function registerCommands() {
  try {
    console.log('[v0] Registering slash commands...');

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
      process.exit(1);
    }

    const data = await response.json();
    console.log(`[v0] Successfully registered ${data.length} slash commands!`);
    console.log('[v0] Commands registered:');
    data.forEach((cmd: any) => {
      console.log(`  ✓ /${cmd.name}`);
    });
  } catch (error) {
    console.error('[v0] Failed to register commands:', error);
    process.exit(1);
  }
}

registerCommands();
