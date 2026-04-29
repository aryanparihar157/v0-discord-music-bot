import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getMusicState, pausePlayback } from '../utils/musicState';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the current song'),

  async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const musicState = getMusicState(interaction.guildId!);

    if (!musicState || !musicState.isPlaying) {
      return interaction.editReply('Nothing is currently playing!');
    }

    const paused = pausePlayback(musicState);

    if (paused) {
      return interaction.editReply(`⏸️ Paused: **${musicState.currentSong?.title}**`);
    }

    return interaction.editReply('Failed to pause playback.');
  },
};

