import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { MusicPlayer } from '../utils/musicPlayer';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set or view the current bot volume')
    .addIntegerOption(option =>
      option
        .setName('percentage')
        .setDescription('Volume level from 0 to 100')
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(100)
    ),

  async run(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'This command can only be used in a server!', ephemeral: true });
    }

    const player = MusicPlayer.getOrCreate(guild.id);
    const percentage = interaction.options.getInteger('percentage');

    if (percentage === null || percentage === undefined) {
      const currentPercent = Math.round(player.volume * 100);
      return interaction.reply(`🔊 The current volume is **${currentPercent}%**.`);
    }

    // Convert percentage (0-100) to volume float (0.0-1.0 or up to 2.0)
    const newVolume = percentage / 100;
    player.setVolume(newVolume);

    return interaction.reply(`🔊 Volume set to **${percentage}%**.`);
  },
};
