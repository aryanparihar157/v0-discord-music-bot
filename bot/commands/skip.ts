import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { MusicPlayer } from '../utils/musicPlayer';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current playing song'),

  async run(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'This command can only be used in a server!', ephemeral: true });
    }

    const player = MusicPlayer.getOrCreate(guild.id);
    const skipped = player.skip();

    if (skipped) {
      return interaction.reply('⏭️ Skipped the current song.');
    } else {
      return interaction.reply({ content: 'There is no song playing to skip!', ephemeral: true });
    }
  },
};
