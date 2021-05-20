import 'reflect-metadata';
import 'express-async-errors';
import { container } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import '../shared/container/index';
import '../providers/index';
import './modules/index';

// eslint-disable-next-line import/no-extraneous-dependencies
import logger from '@config/logger';
import { createConnections } from 'typeorm';
import UsersScript from './modules/users/script/users.script';
import CompaniesScript from './modules/companies/script/companies.script';
import SellingPointsScript from './modules/selling-points/scripts/selling.points.script';
import TelemetriesScript from './modules/telemetries/scripts/telemetries.script';
import CreditsScript from './modules/credits/scripts/credits.script';
import GiftsScript from './modules/gifts/scripts/gifts.script';
import MachineCategoriesScript from './modules/machines-categories/scripts/machines-categories.script';
import MachinesScript from './modules/machines/scripts/machines.script';

const start = async () => {
  // createConnections();
  const ormProvider = container.resolve<OrmProvider>('OrmProvider');
  await ormProvider.connect();

  const usersScript = container.resolve(UsersScript);

  const companiesScript = container.resolve(CompaniesScript);

  const sellingPointsScript = container.resolve(SellingPointsScript);

  const telemetryScript = container.resolve(TelemetriesScript);

  const creditsScript = container.resolve(CreditsScript);

  const giftsScript = container.resolve(GiftsScript);

  const machinesScript = container.resolve(MachinesScript);

  const machineCategoriesScript = container.resolve(MachineCategoriesScript);

  // await usersScript.execute();
  // logger.info('usersScript.execute()');
  // await companiesScript.execute();
  // logger.info('companiesScript.execute()');
  // await machinesScript.createCountersTypes();
  // logger.info('machinesScript.createCountersTypes()');
  // await machineCategoriesScript.execute();
  // logger.info('machineCategoriesScript.execute()');
  // await usersScript.setOwnerId();
  // logger.info('usersScript.setOwnerId');
  // await sellingPointsScript.execute();
  // logger.info('sellingPointsScript.execute()');
  // await usersScript.setGroupIds();
  // logger.info('usersScript.setGroupIds()');
  // await companiesScript.setOwnerId();
  // logger.info('companiesScript.setOwnerId()');
  // await telemetryScript.execute();
  // logger.info('telemetryScript.execute()');

  await creditsScript.execute();
  logger.info('creditsScript.execute()');

  // await giftsScript.execute();
  // logger.info('giftsScript.execute()');
  // await machinesScript.execute();
  // logger.info('machinesScript.execute()');
};

start();
