import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import 'express-async-errors';

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post('/', usersController.create);

export default usersRoutes;
