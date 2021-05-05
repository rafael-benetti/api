import 'reflect-metadata';
import 'express-async-errors';
import { container } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import '../shared/container/index';
import '../providers/index';
import './modules/index';

// eslint-disable-next-line import/no-extraneous-dependencies
import { createConnections } from 'typeorm';
import logger from '@config/logger';
import TypeCountersRepository from './modules/counters/typeorm/repositories/type-counters.repository';

const start = async () => {
  createConnections();
  const ormProvider = container.resolve<OrmProvider>('OrmProvider');
  await ormProvider.connect();

  // const userScript = container.resolve(UserScript);

  // await userScript.execute();
};

start();
