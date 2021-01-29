import appConfig from '@config/app';
import logger from '@config/logger';
import express from 'express';
import cors from 'cors';
import router from './router';

const start = async () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(router);

  app.listen(appConfig.port, () => {
    logger.info(`🎰 - App running on port ${appConfig.port}`);
  });
};

start();
