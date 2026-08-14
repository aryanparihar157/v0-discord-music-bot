import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { MusicPlayer } from '../utils/musicPlayer';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Display the currently playing song details'),

  async run(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'This command can only be used in a server!', ephemeral: true });
    }

    const player = MusicPlayer.getOrCreate(guild.id);
    const current = player.currentSong;

    if (!current) {
      return interaction.reply({ content: 'No song is currently playing!', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('📻 Now Playing')
      .setDescription(`**${current.title}**`)
      .setURL(current.url)
      .setColor('#00ff00')
      .addFields(
        { name: 'Requested By', value: current.addedBy, inline: true }
      );

    if (current.duration) {
      const minutes = Math.floor(current.duration / 60);
      const seconds = current.duration % 60;
      const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      embed.addFields({ name: 'Duration', value: formattedDuration, inline: true });
    }

    return interaction.reply({ embeds: [embed] });
  },
};
