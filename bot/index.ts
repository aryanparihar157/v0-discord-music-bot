import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import * as path from 'path';
import * as fs from 'fs';
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
}) as Client & { commands: Collection<string, any> };

client.commands = new Collection();

// Dynamically load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
const commandsData: any[] = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command && command.data && command.run) {
    client.commands.set(command.data.name, command);
    commandsData.push(command.data.toJSON());
    console.log(`[v0] Loaded command: ${command.data.name}`);
  } else {
    console.warn(`[v0] Command at ${filePath} is missing required "data" or "run" property.`);
  }
}

// Auto-register slash commands with Discord on ready
client.once('ready', async () => {
  console.log(`[v0] Bot is online! Logged in as ${client.user?.tag}`);

  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.error('[v0] DISCORD_TOKEN is missing. Cannot register slash commands.');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(token);
  try {
    console.log(`[v0] Starting slash command registration...`);
    await rest.put(
      Routes.applicationCommands(client.user!.id),
      { body: commandsData }
    );
    console.log(`[v0] Slash commands registered successfully with Discord!`);
  } catch (error) {
    console.error(`[v0] Failed to register slash commands with Discord:`, error);
  }
});

// Handle command interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`[v0] No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.run(interaction, client);
  } catch (error) {
    console.error(`[v0] Error executing command ${interaction.commandName}:`, error);
    const replyPayload = { content: 'There was an error while executing this command!', ephemeral: true };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(replyPayload).catch(() => {});
    } else {
      await interaction.reply(replyPayload).catch(() => {});
    }
  }
});

export default client;
