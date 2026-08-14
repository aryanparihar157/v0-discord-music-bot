import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { MusicPlayer } from '../utils/musicPlayer';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop playing music, clear the queue, and disconnect the bot'),

  async run(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'This command can only be used in a server!', ephemeral: true });
    }

    const player = MusicPlayer.getOrCreate(guild.id);
    player.stop();

    return interaction.reply('⏹️ Music playback stopped, queue cleared, and disconnected from voice channel.');
  },
};
