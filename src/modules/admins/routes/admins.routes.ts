import AppError from '@shared/errors/app-error';
import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import AuthenticateAdminController from '../services/authenticate-admin/authenticate-admin.controller';
import CreateAdminController from '../services/create-admin/create-admin.controller';
import CreateOwnerController from '../services/create-owner/create-owner.controller';
import GetOwnersController from '../services/get-owners/get-owners.controller';

const adminsRoutes = Router();

adminsRoutes.post(
  '/',
  (req, _, next) => {
    if (req.headers.authorization !== 'charanko')
      throw AppError.authorizationError;

    return next();
  },
  celebrate(
    {
      body: {
        email: Joi.string().email().required(),
        name: Joi.string().required(),
      },
    },
    { abortEarly: false },
  ),
  CreateAdminController.handle,
);

adminsRoutes.post(
  '/auth',
  celebrate(
    {
      body: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
    },
    { abortEarly: false },
  ),
  AuthenticateAdminController.handle,
);

adminsRoutes.use(authHandler);

adminsRoutes.post(
  '/owners',
  celebrate(
    {
      body: {
        email: Joi.string().email().required(),
        name: Joi.string().required(),
      },
    },
    { abortEarly: false },
  ),
  CreateOwnerController.handle,
);

adminsRoutes.get('/owners', GetOwnersController.handle);

export default adminsRoutes;
