import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType } from 'discord.js';
import { joinVoiceChannel, VoiceConnectionStatus, entersState } from '@discordjs/voice';
import { MusicPlayer } from '../utils/musicPlayer';
import { resolveSong } from '../utils/ytDlp';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Search and play a song in your voice channel')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('The song name, YouTube URL, or other audio link')
        .setRequired(true)
    ),

  async run(interaction: ChatInputCommandInteraction) {
    const query = interaction.options.getString('query', true);
    const guild = interaction.guild;
    const member = interaction.member;

    if (!guild || !member) {
      return interaction.reply({ content: 'This command can only be used in a server!', ephemeral: true });
    }

    const voiceChannel = (member as any).voice?.channel;
    if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
    }

    await interaction.deferReply();

    try {
      // Resolve the song metadata
      const resolved = await resolveSong(query);
      if (!resolved) {
        return interaction.editReply(`Could not find or resolve any music for: "${query}".`);
      }

      const player = MusicPlayer.getOrCreate(guild.id);

      // Join the voice channel if not already in one
      if (!player.connection) {
        const connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: guild.id,
          adapterCreator: guild.voiceAdapterCreator as any,
        });

        // Wait for connection to be ready (up to 15 seconds)
        try {
          await entersState(connection, VoiceConnectionStatus.Ready, 15000);
          player.setConnection(connection);
        } catch (err) {
          console.error('[v0] VoiceConnection join timeout:', err);
          connection.destroy();
          return interaction.editReply('Failed to connect to the voice channel in time.');
        }

        connection.on('stateChange', (oldState, newState) => {
          console.log(`[v0] VoiceConnection state changed from ${oldState.status} to ${newState.status}`);
          if (newState.status === VoiceConnectionStatus.Destroyed) {
            player.connection = null;
          }
        });

        connection.on('error', (error) => {
          console.error('[v0] VoiceConnection error:', error);
        });
      }

      // Add to player queue
      player.addToQueue({
        title: resolved.title,
        url: resolved.url,
        duration: resolved.duration,
        addedBy: interaction.user.username,
      });

      const isFirst = player.currentSong?.url === resolved.url && player.queue.length === 0;
      const statusText = isFirst ? '▶️ Now playing' : '⏳ Added to queue';
      const queuePosition = player.queue.length;

      return interaction.editReply(
        `${statusText}: **${resolved.title}**${queuePosition > 0 ? ` (Position in queue: #${queuePosition})` : ''}`
      );
    } catch (error) {
      console.error('[v0] Play command error:', error);
      return interaction.editReply('An unexpected error occurred while trying to play the song.');
    }
  },
};
