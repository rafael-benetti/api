import authHandler from '@shared/server/express/middlewares/auth-handler';
import { Router } from 'express';
import GenerateGroupReportController from '../services/generate-group-report/generate-group-report.controller';
import GenerateMachinesController from '../services/generate-machines-report/generate-machines-report.controller';
import GeneratePointsOfSaleReportController from '../services/generate-points-of-sale-report/generate-points-of-sale-report.controller';

const reportsRoutes = Router();

reportsRoutes.use(authHandler);

reportsRoutes.get(
  '/groups',
  GenerateGroupReportController.validate,
  GenerateGroupReportController.handle,
);

reportsRoutes.get(
  '/points-of-sale',
  GeneratePointsOfSaleReportController.validate,
  GeneratePointsOfSaleReportController.handle,
);

reportsRoutes.get(
  '/machines',
  GenerateMachinesController.validate,
  GenerateMachinesController.handle,
);

export default reportsRoutes;
