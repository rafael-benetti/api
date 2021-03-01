import AuthenticateAdminController from '@modules/admins/services/authenticate-admin/authenticate-admin.controller';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import AuthenticateUserController from '../services/authenticate-user/authenticate-user.controller';

const sessionsRoutes = Router();

sessionsRoutes.post(
  '/',
  celebrate({
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  AuthenticateUserController.create,
);

sessionsRoutes.post(
  '/admins',
  celebrate({
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  AuthenticateAdminController.create,
);

export default sessionsRoutes;
