import authHandler from '@shared/server/express/middlewares/auth-handler';
import { Router } from 'express';
import DetailGroupControllerV2 from '../services/detail-group/detail-group.controller.v2';

const groupsRoutes = Router();

groupsRoutes.use(authHandler);

groupsRoutes.get(
  '/:groupId',
  DetailGroupControllerV2.validate,
  DetailGroupControllerV2.handle,
);

export default groupsRoutes;
