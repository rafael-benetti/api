import authHandler from '@shared/server/express/middlewares/auth-handler';
import { Router } from 'express';
import DashboardInfoControllerV2 from '../services/dashboard-info/dashboard-info.controller.v2';

const usersRoutesV2 = Router();

usersRoutesV2.use(authHandler);

usersRoutesV2.get(
  '/dashboard',
  DashboardInfoControllerV2.validate,
  DashboardInfoControllerV2.handle,
);

export default usersRoutesV2;
