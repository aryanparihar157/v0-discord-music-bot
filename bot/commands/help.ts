import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available bot commands'),

  async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Discord Music Bot - Commands')
      .setDescription('Here are all available commands for the music bot')
      .addFields(
        {
          name: '▶️ Playback Commands',
          value:
            '`/play <query>` - Play a song by name, link, or search\n' +
            '`/pause` - Pause the current song\n' +
            '`/resume` - Resume playback\n' +
            '`/skip` - Skip to the next song\n' +
            '`/stop` - Stop playback and clear queue',
          inline: false,
        },
        {
          name: '📋 Queue Commands',
          value:
            '`/queue` - View the current queue\n' +
            '`/nowplaying` - Show currently playing song\n' +
            '`/clearqueue` - Clear all songs from queue\n' +
            '`/shuffle` - Randomize the queue order',
          inline: false,
        },
        {
          name: '🔊 Volume Commands',
          value:
            '`/volume <level>` - Set volume (0-200%)',
          inline: false,
        },
        {
          name: '📚 Info Commands',
          value:
            '`/help` - Show this message\n' +
            '`/botinfo` - Show bot information',
          inline: false,
        }
      )
      .addFields({
        name: '💡 Usage Examples',
        value:
          '• `/play never gonna give you up` - Search for a song\n' +
          '• `/play https://www.youtube.com/watch?v=...` - Play from YouTube\n' +
          '• `/play https://open.spotify.com/track/...` - Play from Spotify\n' +
          '• `/volume 100` - Set volume to 100%',
        inline: false,
      })
      .setFooter({
        text: 'Discord Music Bot | Use /help anytime for assistance',
      });

    return interaction.editReply({ embeds: [embed] });
  },
};

