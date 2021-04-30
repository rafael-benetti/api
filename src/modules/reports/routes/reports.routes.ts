import authHandler from '@shared/server/express/middlewares/auth-handler';
import { Router } from 'express';
import GenerateGroupReportController from '../services/generate-group-report/generate-group-report.controller';

const reportsRoutes = Router();

reportsRoutes.use(authHandler);

reportsRoutes.get(
  '/groups',
  GenerateGroupReportController.validate,
  GenerateGroupReportController.handle,
);

export default reportsRoutes;
