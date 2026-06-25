import client from '../bot';
import * as http from 'http';

const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  console.error('Error: DISCORD_TOKEN environment variable is not set');
  process.exit(1);
}

// Start the Discord bot
client.login(TOKEN);

// Start a simple HTTP server for health checks (e.g. Hugging Face Spaces requires port 7860)
const PORT = process.env.PORT || 7860;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Discord Music Bot is running!\n');
});

server.listen(PORT, () => {
  console.log(`[v0] Health check server listening on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down bot...');
  server.close();
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down bot...');
  server.close();
  client.destroy();
  process.exit(0);
});

