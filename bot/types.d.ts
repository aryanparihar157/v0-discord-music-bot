import { Collection } from 'discord.js';

declare global {
  namespace Discord {
    interface Client {
      commands: Collection<string, any>;
      musicStates: Map<string, any>;
    }
  }
}
