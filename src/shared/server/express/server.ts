import 'reflect-metadata';
import appConfig from '@config/app';
import logger from '@config/logger';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { container } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import morgan from 'morgan';
import '../../container/index';
import router from './router';
import errorHandler from './middlewares/error-handler';

const start = async () => {
  const ormProvider = container.resolve<OrmProvider>('OrmProvider');
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
