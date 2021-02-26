import 'reflect-metadata';
import appConfig from '@config/app';
import logger from '@config/logger';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import IOrmProvider from '@providers/OrmProvider/contracts/models/OrmProvider';
import { container } from 'tsyringe';
import router from './router';
import '../../container/index';
import 'express-async-errors';
import errorHandler from './middlewares/error-handler';

const start = async () => {
  const ormProvider = container.resolve<IOrmProvider>('OrmProvider');
  await ormProvider.connect();

  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(morgan('dev'));

  app.use(ormProvider.forkMiddleware);

  app.use(router);

  app.use(errorHandler);

  app.listen(appConfig.port, () => {
    logger.info(`🎰 - App running on port ${appConfig.port}`);
  });
};

start();
