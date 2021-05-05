import 'reflect-metadata';
import 'express-async-errors';
import { container } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import '../shared/container/index';
import '../providers/index';
import './modules/index';

// eslint-disable-next-line import/no-extraneous-dependencies
import { createConnections } from 'typeorm';
import UsersScript from './modules/users/script/users.script';
import CompaniesScript from './modules/companies/script/companies.script';
import SellingPointsScript from './modules/selling-points/scripts/selling.points.script';

const start = async () => {
  createConnections();
  const ormProvider = container.resolve<OrmProvider>('OrmProvider');
  await ormProvider.connect();

  const usersScript = container.resolve(UsersScript);

  const companiesScript = container.resolve(CompaniesScript);

  const sellingPointsScript = container.resolve(SellingPointsScript);

  await usersScript.execute();

  await companiesScript.execute();

  await sellingPointsScript.execute();

  await usersScript.setGroupIds();

  await usersScript.setOwnerId();

  await companiesScript.setOwnerId();
};

start();
