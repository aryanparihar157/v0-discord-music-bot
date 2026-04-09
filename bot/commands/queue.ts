import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { getMusicState } from '../utils/musicState';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('View the current music queue'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const musicState = getMusicState(interaction.guildId!);

    if (!musicState || (musicState.queue.length === 0 && !musicState.currentSong)) {
      return interaction.editReply('The queue is empty!');
    }

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Music Queue')
      .setDescription('Current songs in queue');

    // Add current song
    if (musicState.currentSong) {
      embed.addFields({
        name: '▶️ Now Playing',
        value: `${musicState.currentSong.title}\nAdded by: ${musicState.currentSong.addedBy}`,
        inline: false,
      });
    }

    // Add queued songs
    if (musicState.queue.length > 0) {
      const queueList = musicState.queue
        .slice(0, 10)
        .map(
          (song, index) =>
            `${index + 1}. **${song.title}** (by ${song.addedBy})`
        )
        .join('\n');

      embed.addFields({
        name: `📋 Queue (${musicState.queue.length} songs)`,
        value: queueList,
        inline: false,
      });

      if (musicState.queue.length > 10) {
        embed.setFooter({ text: `+${musicState.queue.length - 10} more songs...` });
      }
    }

    // Add status info
    const status = musicState.isPaused ? 'Paused' : musicState.isPlaying ? 'Playing' : 'Stopped';
    const volume = Math.round(musicState.volume * 100);
    
    embed.addFields({
      name: '📊 Status',
      value: `Status: ${status}\nVolume: ${volume}%`,
      inline: false,
    });

    return interaction.editReply({ embeds: [embed] });
  },
};
