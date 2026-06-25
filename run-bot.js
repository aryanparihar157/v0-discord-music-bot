require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    esModuleInterop: true
  }
});

console.log("Starting Discord bot client...");
require('./scripts/start-bot');
