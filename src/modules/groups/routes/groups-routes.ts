import authHandler from '@shared/server/express/middlewares/auth-handler';
import { Router } from 'express';
import CreateGroupController from '../services/create-group/create-group-controller';
import ListGroupsController from '../services/list-groups/list-groups.controller';

const groupRoutes = Router();

groupRoutes.use(authHandler);

groupRoutes.post('/', CreateGroupController.handle);

groupRoutes.get('/', ListGroupsController.handle);

export default groupRoutes;
