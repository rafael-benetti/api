module.exports = {
  apps: [
    {
      name: 'benv:server',
      script: './build/shared/server/express/server.js',
      node_args: '-r dotenv/config',
    },
  ],
};
