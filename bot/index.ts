import { Client, GatewayIntentBits } from 'discord.js';
import { join } from 'path';
import { loadCommands } from './utils/commandLoader';
import ffmpeg from 'ffmpeg-static';

if (ffmpeg) {
  process.env.FFMPEG_PATH = ffmpeg;
  console.log(`[v0] Set FFMPEG_PATH to: ${ffmpeg}`);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Load command files
const commandsPath = join(__dirname, 'commands');
(client as any).commands = loadCommands(commandsPath);

// Store guild music states
(client as any).musicStates = new Map();

client.once('ready', () => {
  console.log(`[v0] Bot is online! Logged in as ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = (client as any).commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.run(interaction, client);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

export default client;
