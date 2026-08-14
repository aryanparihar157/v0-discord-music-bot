import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { MusicPlayer } from '../utils/musicPlayer';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume the paused audio playback'),

  async run(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'This command can only be used in a server!', ephemeral: true });
    }

    const player = MusicPlayer.getOrCreate(guild.id);
    const resumed = player.resume();

    if (resumed) {
      return interaction.reply('▶️ Audio playback resumed.');
    } else {
      return interaction.reply({ content: 'Audio is not paused or is already playing!', ephemeral: true });
    }
  },
};
