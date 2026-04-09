import client from '../bot';

const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  console.error('Error: DISCORD_TOKEN environment variable is not set');
  process.exit(1);
}

// Start the Discord bot
client.login(TOKEN);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down bot...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down bot...');
  client.destroy();
  process.exit(0);
});
