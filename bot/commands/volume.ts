import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getMusicState, setVolume } from '../utils/musicState';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set the playback volume')
    .addNumberOption(option =>
      option
        .setName('level')
        .setDescription('Volume level (0-200%)')
        .setMinValue(0)
        .setMaxValue(200)
        .setRequired(true)
    ),

  async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const level = interaction.options.getNumber('level')!;
    const volumeValue = level / 100;

    const musicState = getMusicState(interaction.guildId!);

    if (!musicState) {
      return interaction.editReply('No music is loaded for this server.');
    }

    setVolume(musicState, volumeValue);

    return interaction.editReply(`🔊 Volume set to **${level}%**`);
  },
};

