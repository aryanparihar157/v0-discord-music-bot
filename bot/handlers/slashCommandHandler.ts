import { InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';
import { searchMusic, parseMusicUrl } from '../utils/musicSearch';

interface Interaction {
  type: number;
  data: {
    name: string;
    options?: Array<{
      name: string;
      value: string;
    }>;
  };
  member?: {
    user: {
      id: string;
      username: string;
    };
  };
  user?: {
    id: string;
    username: string;
  };
  guild_id: string;
  channel_id: string;
}

export async function handleSlashCommand(interaction: Interaction) {
  const commandName = interaction.data.name;
  const options = interaction.data.options || [];
  const userId = interaction.member?.user.id || interaction.user?.id || 'unknown';
  const userName = interaction.member?.user.username || interaction.user?.username || 'unknown';

  try {
    switch (commandName) {
      case 'play': {
        const query = options.find((o) => o.name === 'query')?.value || '';
        if (!query) {
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: 'Please provide a song name, YouTube link, or Spotify URL.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        }

        // Search for the song
        const results = await searchMusic(query);
        
        if (!results || results.length === 0) {
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `No results found for "${query}". Try a different search term.`,
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        }

        const song = results[0];
        
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `🎵 **Now Playing**: ${song.title}\n\n📝 Source: ${song.source === 'youtube' ? '▶️ YouTube' : song.source === 'spotify' ? '🎧 Spotify' : '🔗 Direct Link'}\n👤 Requested by: <@${userId}>`,
          },
        };
      }

      case 'queue': {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '📋 **Queue**\n\nCurrent queue is empty. Use `/play` to add songs!',
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        };
      }

      case 'pause': {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '⏸️ Playback paused.',
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        };
      }

      case 'resume': {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '▶️ Playback resumed.',
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        };
      }

      case 'skip': {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '⏭️ Song skipped.',
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        };
      }

      case 'stop': {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '⏹️ Playback stopped and queue cleared.',
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        };
      }

      case 'volume': {
        const volume = options.find((o) => o.name === 'level')?.value || '50';
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `🔊 Volume set to ${volume}%`,
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        };
      }

      case 'nowplaying': {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '🎵 Currently playing: No song is playing.',
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        };
      }

      case 'help': {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `🎵 **Music Bot Commands**
            
\`/play <song>\` - Play a song by name, YouTube link, or Spotify URL
\`/pause\` - Pause playback
\`/resume\` - Resume playback
\`/skip\` - Skip to the next song
\`/stop\` - Stop playback and clear queue
\`/queue\` - View the music queue
\`/volume <0-200>\` - Adjust volume
\`/nowplaying\` - Show currently playing song
\`/shuffle\` - Shuffle the queue
\`/clearqueue\` - Clear all songs from queue
\`/help\` - Show this message`,
          },
        };
      }

      default: {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Unknown command: \`/${commandName}\``,
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        };
      }
    }
  } catch (error) {
    console.error(`Error handling command ${commandName}:`, error);
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'An error occurred while processing your command.',
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    };
  }
}
