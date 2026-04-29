import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, version } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Show information about the bot'),

  async run(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply();

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Discord Music Bot Information')
      .addFields(
        {
          name: '👤 Bot Name',
          value: client.user?.username || 'Unknown',
          inline: true,
        },
        {
          name: '🆔 Bot ID',
          value: client.user?.id || 'Unknown',
          inline: true,
        },
        {
          name: '📅 Created',
          value: client.user?.createdAt?.toDateString() || 'Unknown',
          inline: true,
        },
        {
          name: '🖥️ Discord.js Version',
          value: version,
          inline: true,
        },
        {
          name: '⏱️ Uptime',
          value: formatUptime(client.uptime || 0),
          inline: true,
        },
        {
          name: '📍 Server Count',
          value: (client.guilds?.cache?.size || 0).toString(),
          inline: true,
        },
        {
          name: '🎵 Features',
          value:
            '✓ YouTube Support\n' +
            '✓ Spotify Support\n' +
            '✓ Apple Music Support\n' +
            '✓ Queue Management\n' +
            '✓ Volume Control\n' +
            '✓ Shuffle & Skip',
          inline: false,
        }
      )
      .setFooter({
        text: 'Discord Music Bot | Version 1.0.0',
      });

    return interaction.editReply({ embeds: [embed] });
  },
};

function formatUptime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

