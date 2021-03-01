import authHandler from '@shared/server/express/middlewares/auth-handler';
import { Router } from 'express';
import CreateGroupController from '../services/create-group/create-group-controller';

const groupRoutes = Router();

const createGroupController = new CreateGroupController();

groupRoutes.use(authHandler);

groupRoutes.post('/', createGroupController.handle);

export default groupRoutes;
