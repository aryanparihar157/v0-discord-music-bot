import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { getMusicState } from '../utils/musicState';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Show information about the currently playing song'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const musicState = getMusicState(interaction.guildId!);

    if (!musicState || !musicState.currentSong) {
      return interaction.editReply('Nothing is currently playing!');
    }

    const song = musicState.currentSong;
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Now Playing')
      .addFields(
        {
          name: '🎵 Song',
          value: song.title,
          inline: false,
        },
        {
          name: '📍 Source',
          value: song.source.toUpperCase(),
          inline: true,
        },
        {
          name: '👤 Added by',
          value: song.addedBy,
          inline: true,
        }
      );

    if (song.duration) {
      const minutes = Math.floor(song.duration / 60);
      const seconds = song.duration % 60;
      embed.addFields({
        name: '⏱️ Duration',
        value: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        inline: true,
      });
    }

    const status = musicState.isPaused ? 'Paused' : 'Playing';
    embed.setFooter({ text: `Status: ${status} | Queue: ${musicState.queue.length} songs` });

    return interaction.editReply({ embeds: [embed] });
  },
};
