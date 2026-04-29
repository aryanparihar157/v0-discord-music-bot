import { Client, GatewayIntentBits } from 'discord.js';
import { join } from 'path';
import { loadCommands } from './utils/commandLoader';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

// Load command files
const commandsPath = join(__dirname, 'commands');
client.commands = loadCommands(commandsPath);

// Store guild music states
client.musicStates = new Map();

client.once('ready', () => {
  // Bot logged in successfully
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

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
