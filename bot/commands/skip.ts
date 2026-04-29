import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getMusicState, skipSong } from '../utils/musicState';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),

  async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const musicState = getMusicState(interaction.guildId!);

    if (!musicState || !musicState.currentSong) {
      return interaction.editReply('Nothing is currently playing!');
    }

    const skipped = skipSong(musicState);

    if (skipped) {
      return interaction.editReply(`⏭️ Skipped: **${skipped.title}**`);
    }

    return interaction.editReply('Failed to skip the song.');
  },
};

