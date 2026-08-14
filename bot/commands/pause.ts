import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { MusicPlayer } from '../utils/musicPlayer';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause the current audio playback'),

  async run(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'This command can only be used in a server!', ephemeral: true });
    }

    const player = MusicPlayer.getOrCreate(guild.id);
    const paused = player.pause();

    if (paused) {
      return interaction.reply('⏸️ Audio playback paused.');
    } else {
      return interaction.reply({ content: 'Audio is not playing or is already paused!', ephemeral: true });
    }
  },
};
