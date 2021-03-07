import CreateUserController from '@modules/users/services/create-user/create-user-controller';
import authHandler from '@shared/server/express/middlewares/auth-handler';
import { Router } from 'express';

const routesRoutes = Router();

routesRoutes.use(authHandler);

routesRoutes.post('/', CreateUserController.handle);

export default routesRoutes;
