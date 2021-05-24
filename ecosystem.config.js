module.exports = {
  apps: [
    {
      name: 'benv:server',
      script: './dist/shared/infra/express/server.js',
      node_args: '-r dotenv/config',
    },
  ],
};
