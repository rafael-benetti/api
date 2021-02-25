import appConfig from '@config/app';
import logger from '@config/logger';
import express from 'express';
import cors from 'cors';
import { createConnections } from 'typeorm';
import morgan from 'morgan';
import path from 'path';
import router from './router';
import '../../container/index';
import 'express-async-errors';
import errorHandler from './middlewares/error-handler';

const start = async () => {
  createConnections();

  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(morgan('dev'));

  app.use(
    '/files',
    express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')),
  );

  app.use(router);

  app.use(errorHandler);

  app.listen(appConfig.port, () => {
    logger.info(`🎰 - App running on port ${appConfig.port}`);
  });
};

start();
