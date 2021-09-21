module.exports = {
  apps: [
    {
      name: 'black-telemetry:server',
      script: './build/shared/server/express/server.js',
      node_args: '-r dotenv/config',
    },
  ],
};
