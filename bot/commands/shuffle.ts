import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getMusicState } from '../utils/musicState';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffle the current queue'),

  async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const musicState = getMusicState(interaction.guildId!);

    if (!musicState || musicState.queue.length === 0) {
      return interaction.editReply('The queue is empty! Add some songs first.');
    }

    musicState.queue = shuffleArray(musicState.queue);

    return interaction.editReply(
      `🔀 Shuffled the queue! (${musicState.queue.length} songs randomized)`
    );
  },
};

