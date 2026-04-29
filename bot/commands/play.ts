import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import { getOrCreateMusicState, addToQueue, playNextSong } from '../utils/musicState';
import { searchMusic, parseMusicUrl } from '../utils/musicSearch';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from a link, Spotify, YouTube, or song name')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('Song name, YouTube link, Spotify link, or Apple Music link')
        .setRequired(true)
    ),

  async run(interaction: ChatInputCommandInteraction, client: any) {
    await interaction.deferReply();

    const query = interaction.options.getString('query');
    const member = interaction.guild?.members.cache.get(interaction.user.id);
    const voiceChannel = member?.voice.channel;

    // Check if user is in a voice channel
    if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
      return interaction.editReply('You must be in a voice channel to use this command!');
    }

    // Check bot permissions
    if (!voiceChannel.permissionsFor(client.user).has('Connect')) {
      return interaction.editReply("I don't have permission to join your voice channel!");
    }

    try {
      // Get or create music state for this guild
      const musicState = getOrCreateMusicState(interaction.guild!);

      let song = null;

      // Check if it's a URL
      if (query.startsWith('http')) {
        song = await parseMusicUrl(query, query);
      }

      // If not a URL or parsing failed, search for the song
      if (!song) {
        const results = await searchMusic(query);
        if (results.length === 0) {
          return interaction.editReply(`No results found for "${query}". Try a direct link or search term.`);
        }
        song = results[0];
      }

      if (!song) {
        return interaction.editReply('Failed to process your request. Please try again.');
      }

      // Add to queue
      addToQueue(musicState, {
        title: song.title,
        url: song.url,
        source: song.source,
        duration: song.duration,
        addedBy: interaction.user.username,
      });

      // Join voice channel if not already connected
      if (!musicState.voiceChannel) {
        musicState.voiceChannel = voiceChannel;
        const connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: interaction.guild!.id,
          adapterCreator: interaction.guild!.voiceAdapterCreator,
        });

        // Subscribe the connection to the player
        connection.subscribe(musicState.player);
        console.log(`[v0] Joined voice channel ${voiceChannel.name} in guild ${interaction.guild!.id}`);
      }

      // If nothing is playing, start playing
      if (!musicState.isPlaying && !musicState.currentSong) {
        musicState.currentSong = musicState.queue.shift();
        console.log(`[v0] Starting playback of: ${musicState.currentSong?.title}`);
        await playNextSong(musicState);
      }

      const queuePosition = musicState.queue.length;
      const status = musicState.isPlaying ? '▶️ Added to queue' : '⏸️ First in queue';
      
      return interaction.editReply(
        `${status}: **${song.title}** (position: ${queuePosition + 1})`
      );
    } catch (error) {
      console.error('Play command error:', error);
      return interaction.editReply('An error occurred while trying to play the song.');
    }
  },
};

