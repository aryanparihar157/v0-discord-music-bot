import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { MusicPlayer } from '../utils/musicPlayer';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Display the current music queue'),

  async run(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({ content: 'This command can only be used in a server!', ephemeral: true });
    }

    const player = MusicPlayer.getOrCreate(guild.id);
    const queue = player.queue;
    const current = player.currentSong;

    if (!current && queue.length === 0) {
      return interaction.reply('📭 The queue is currently empty.');
    }

    const embed = new EmbedBuilder()
      .setTitle(`Music Queue for ${guild.name}`)
      .setColor('#0099ff');

    if (current) {
      embed.addFields({ 
        name: '▶️ Now Playing', 
        value: `**${current.title}** (Requested by: *${current.addedBy}*)` 
      });
    }

    if (queue.length > 0) {
      const queueList = queue
        .slice(0, 10)
        .map((song, i) => `${i + 1}. **${song.title}** (Requested by: *${song.addedBy}*)`)
        .join('\n');

      embed.addFields({ 
        name: '⏳ Upcoming Songs', 
        value: queueList + (queue.length > 10 ? `\n*...and ${queue.length - 10} more songs in queue.*` : '') 
      });
    } else {
      embed.addFields({ name: '⏳ Upcoming Songs', value: 'No songs in queue.' });
    }

    return interaction.reply({ embeds: [embed] });
  },
};
