import AppError from '@shared/errors/app-error';
import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateAdminController from '../services/create-admin/create-admin.controller';
import CreateOwnerController from '../services/create-owner/create-owner.controller';

const adminsRouter = Router();

adminsRouter.post(
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
        password: Joi.string()
          .regex(/^(?=.*[A-z])(?=.*[0-9])(?=.{1,})/)
          .required(),
        name: Joi.string().required(),
      },
    },
    { abortEarly: false },
  ),
  CreateAdminController.handle,
);

adminsRouter.use(authHandler);

adminsRouter.post(
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

export default adminsRouter;
