import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getMusicState, stopPlayback } from '../utils/musicState';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop playback and clear the queue'),

  async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const musicState = getMusicState(interaction.guildId!);

    if (!musicState || (!musicState.isPlaying && musicState.queue.length === 0)) {
      return interaction.editReply('Nothing is currently playing!');
    }

    stopPlayback(musicState);

    return interaction.editReply('⏹️ Stopped playback and cleared the queue.');
  },
};

