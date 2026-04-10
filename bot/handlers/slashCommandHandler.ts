import { InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';
import { searchMusic, parseMusicUrl } from '../utils/musicSearch';
import { getOrCreateMusicState, addToQueue, playNextSong } from '../utils/musicState';
import { Client, REST, Routes } from 'discord.js';

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

        try {
          // Get music state for the guild
          const musicState = getOrCreateMusicState({
            id: interaction.guild_id,
          } as any);

          let song = null;

          // Check if it's a URL
          if (query.startsWith('http')) {
            song = await parseMusicUrl(query, query);
          }

          // If not a URL or parsing failed, search for the song
          if (!song) {
            const results = await searchMusic(query);
            if (results.length === 0) {
              return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  content: `No results found for "${query}". Try a different search term.`,
                  flags: InteractionResponseFlags.EPHEMERAL,
                },
              };
            }
            song = results[0];
          }

          // Add to queue
          addToQueue(musicState, {
            title: song.title,
            url: song.url,
            source: song.source,
            duration: song.duration,
            addedBy: userName,
          });

          console.log(`[v0] Added "${song.title}" to queue for guild ${interaction.guild_id}`);

          // If nothing is playing, start playing
          if (!musicState.isPlaying && !musicState.currentSong) {
            musicState.currentSong = musicState.queue.shift();
            await playNextSong(musicState);
            console.log(`[v0] Started playing: ${song.title}`);
          }

          const queuePosition = musicState.queue.length + 1;
          const status = !musicState.isPlaying ? '⏸️ Queued' : '▶️ Added to queue';
          
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${status}: **${song.title}** (position: ${queuePosition})\n📝 Source: ${song.source === 'youtube' ? '▶️ YouTube' : song.source === 'spotify' ? '🎧 Spotify' : song.source === 'search' ? '🔍 Search' : '🔗 Direct'}\n👤 Requested by: <@${userId}>`,
            },
          };
        } catch (error) {
          console.error(`[v0] Error in play command:`, error);
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Error processing song: ${String(error)}`,
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        }
      }

      case 'queue': {
        try {
          const musicState = getOrCreateMusicState({
            id: interaction.guild_id,
          } as any);

          if (!musicState.currentSong && musicState.queue.length === 0) {
            return {
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: '📋 **Queue**\n\nCurrent queue is empty. Use `/play` to add songs!',
                flags: InteractionResponseFlags.EPHEMERAL,
              },
            };
          }

          let queueText = '📋 **Queue**\n\n';
          if (musicState.currentSong) {
            queueText += `🎵 **Now Playing**: ${musicState.currentSong.title}\n\n`;
          }

          if (musicState.queue.length > 0) {
            queueText += '**Up Next:**\n';
            musicState.queue.slice(0, 10).forEach((song, index) => {
              queueText += `${index + 1}. ${song.title} - *Added by ${song.addedBy}*\n`;
            });
            if (musicState.queue.length > 10) {
              queueText += `\n... and ${musicState.queue.length - 10} more songs`;
            }
          }

          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: queueText,
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        } catch (error) {
          console.error(`[v0] Error in queue command:`, error);
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: 'Error retrieving queue.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        }
      }

      case 'pause': {
        try {
          const musicState = getOrCreateMusicState({
            id: interaction.guild_id,
          } as any);

          if (!musicState.isPlaying) {
            return {
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: 'No song is currently playing.',
                flags: InteractionResponseFlags.EPHEMERAL,
              },
            };
          }

          musicState.player.pause();
          musicState.isPaused = true;

          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `⏸️ Playback paused: **${musicState.currentSong?.title}**`,
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        } catch (error) {
          console.error(`[v0] Error in pause command:`, error);
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: 'Error pausing playback.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        }
      }

      case 'resume': {
        try {
          const musicState = getOrCreateMusicState({
            id: interaction.guild_id,
          } as any);

          if (!musicState.isPaused) {
            return {
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: 'No paused song to resume.',
                flags: InteractionResponseFlags.EPHEMERAL,
              },
            };
          }

          musicState.player.unpause();
          musicState.isPaused = false;

          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `▶️ Playback resumed: **${musicState.currentSong?.title}**`,
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        } catch (error) {
          console.error(`[v0] Error in resume command:`, error);
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: 'Error resuming playback.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        }
      }

      case 'skip': {
        try {
          const musicState = getOrCreateMusicState({
            id: interaction.guild_id,
          } as any);

          if (!musicState.currentSong) {
            return {
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: 'No song is currently playing.',
                flags: InteractionResponseFlags.EPHEMERAL,
              },
            };
          }

          const skipped = musicState.currentSong;
          musicState.player.stop();

          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `⏭️ Skipped: **${skipped.title}**`,
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        } catch (error) {
          console.error(`[v0] Error in skip command:`, error);
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: 'Error skipping song.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        }
      }

      case 'stop': {
        try {
          const musicState = getOrCreateMusicState({
            id: interaction.guild_id,
          } as any);

          musicState.queue = [];
          musicState.currentSong = undefined;
          musicState.isPlaying = false;
          musicState.isPaused = false;
          musicState.player.stop();

          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: '⏹️ Playback stopped and queue cleared.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        } catch (error) {
          console.error(`[v0] Error in stop command:`, error);
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: 'Error stopping playback.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        }
      }

      case 'volume': {
        try {
          const volumeStr = options.find((o) => o.name === 'level')?.value || '100';
          const volumeNum = Math.max(0, Math.min(200, parseInt(volumeStr)));
          
          const musicState = getOrCreateMusicState({
            id: interaction.guild_id,
          } as any);

          musicState.volume = volumeNum / 100;

          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `🔊 Volume set to ${volumeNum}%`,
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        } catch (error) {
          console.error(`[v0] Error in volume command:`, error);
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: 'Error setting volume.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        }
      }

      case 'nowplaying': {
        try {
          const musicState = getOrCreateMusicState({
            id: interaction.guild_id,
          } as any);

          if (!musicState.currentSong) {
            return {
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: '🎵 No song is currently playing. Use `/play` to queue a song!',
                flags: InteractionResponseFlags.EPHEMERAL,
              },
            };
          }

          let status = '▶️ Playing';
          if (musicState.isPaused) status = '⏸️ Paused';

          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${status}: **${musicState.currentSong.title}**\n📝 Source: ${musicState.currentSong.source}\n👤 Added by: ${musicState.currentSong.addedBy}`,
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        } catch (error) {
          console.error(`[v0] Error in nowplaying command:`, error);
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: 'Error retrieving now playing info.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          };
        }
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
