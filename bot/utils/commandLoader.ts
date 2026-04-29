import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

export function loadCommands(commandsPath: string) {
  const commands = new Collection<string, any>();
  const commandFiles = readdirSync(commandsPath).filter(
    file => file.endsWith('.ts') || file.endsWith('.js')
  );

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = require(filePath);
    
    // We expect a data property and a run property for our commands
    if ('data' in command && 'run' in command) {
      commands.set(command.data.name, command);
    }
  }

  return commands;
}
