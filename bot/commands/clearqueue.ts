import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getMusicState } from '../utils/musicState';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearqueue')
    .setDescription('Clear all songs from the queue (except current song)'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const musicState = getMusicState(interaction.guildId!);

    if (!musicState || musicState.queue.length === 0) {
      return interaction.editReply('The queue is already empty!');
    }

    const clearedCount = musicState.queue.length;
    musicState.queue = [];

    return interaction.editReply(`🗑️ Cleared **${clearedCount}** songs from the queue.`);
  },
};
