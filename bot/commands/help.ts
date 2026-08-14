import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all available music commands'),

  async run(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('🎵 Discord Music Bot Help')
      .setDescription('Here is a list of all available slash commands:')
      .setColor('#9b59b6')
      .addFields(
        { name: '/play <query>', value: 'Plays a song or adds it to the queue (supports search queries & direct URLs).' },
        { name: '/skip', value: 'Skips the currently playing song.' },
        { name: '/stop', value: 'Stops playback, clears the queue, and disconnects the bot from the voice channel.' },
        { name: '/pause', value: 'Pauses the current audio playback.' },
        { name: '/resume', value: 'Resumes the paused audio playback.' },
        { name: '/queue', value: 'Shows the current queue of upcoming songs.' },
        { name: '/nowplaying', value: 'Shows details of the song that is currently playing.' },
        { name: '/volume <0-100>', value: 'Adjusts the volume of the bot.' },
        { name: '/help', value: 'Displays this help message.' }
      );

    return interaction.reply({ embeds: [embed] });
  },
};
