import { REST, Routes } from 'discord.js';
import { join } from 'path';
import { loadCommands } from './utils/commandLoader';

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!TOKEN || !CLIENT_ID) {
  throw new Error('Missing required environment variables: DISCORD_TOKEN, DISCORD_CLIENT_ID');
}

const commandsPath = join(__dirname, 'commands');
const loadedCommands = loadCommands(commandsPath);
const commands = loadedCommands.map(cmd => cmd.data.toJSON());

const rest = new REST().setToken(TOKEN);

(async () => {
  try {
    // Register commands globally if no guild ID, or to specific guild if provided
    const route = GUILD_ID
      ? Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)
      : Routes.applicationCommands(CLIENT_ID);

    await rest.put(route, { body: commands });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
