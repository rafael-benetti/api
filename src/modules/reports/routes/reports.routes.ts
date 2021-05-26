import authHandler from '@shared/server/express/middlewares/auth-handler';
import { Router } from 'express';
import GenerateCollectionsReportController from '../services/generate-collections-report/generate-collections-report.controller';
import GenerateGroupReportController from '../services/generate-group-report/generate-group-report.controller';
import GenerateMachinesController from '../services/generate-machines-report/generate-machines-report.controller';
import GeneratePointsOfSaleReportController from '../services/generate-points-of-sale-report/generate-points-of-sale-report.controller';
import GenerateStockReportController from '../services/generate-stock-report/generate-stock-report.controller';

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

reportsRoutes.get(
  '/collections',
  GenerateCollectionsReportController.validate,
  GenerateCollectionsReportController.handle,
);

reportsRoutes.get(
  '/stocks',
  GenerateStockReportController.validate,
  GenerateStockReportController.handle,
);

export default reportsRoutes;
