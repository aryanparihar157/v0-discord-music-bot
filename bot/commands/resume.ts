import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getMusicState, resumePlayback } from '../utils/musicState';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume the paused song'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const musicState = getMusicState(interaction.guildId!);

    if (!musicState || !musicState.isPaused) {
      return interaction.editReply('Nothing is paused right now!');
    }

    const resumed = resumePlayback(musicState);

    if (resumed) {
      return interaction.editReply(`▶️ Resumed: **${musicState.currentSong?.title}**`);
    }

    return interaction.editReply('Failed to resume playback.');
  },
};
