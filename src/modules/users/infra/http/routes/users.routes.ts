import { Router } from 'express';
import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import UsersController from '../controllers/UsersController';
import 'express-async-errors';

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post('/', usersController.create);

usersRoutes.use(ensureAuthentication);

usersRoutes.get('/', usersController.show);

export default usersRoutes;
