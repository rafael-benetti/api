import { Router } from 'express';
import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { celebrate, Joi } from 'celebrate';
import UsersController from '../controllers/UsersController';
import 'express-async-errors';

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post(
  '/',
  celebrate({
    body: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(10).max(11).required(),
      username: Joi.string().required(),
      password: Joi.string()
        .regex(/^(?=.*[A-z])(?=.*[0-9])(?=.{1,})/)
        .required(),
      isActive: Joi.number().valid(0, 1).required(),
      isOperator: Joi.number().valid(0, 1),
      roles: Joi.string(),
      ownerId: Joi.number().required(),
    },
  }),
  usersController.create,
);

usersRoutes.use(ensureAuthentication);

usersRoutes.patch('/', usersController.update);

export default usersRoutes;
