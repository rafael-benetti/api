import AppError from '@shared/errors/app-error';
import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import AuthenticateAdminController from '../services/authenticate-admin/authenticate-admin.controller';
import CreateAdminController from '../services/create-admin/create-admin.controller';
import CreateOwnerController from '../services/create-owner/create-owner.controller';
import CreateTelemetryBoardController from '../services/create-telemetry-board/create-telemetry-board.controller';
import DeleteLogsController from '../services/delete-logs/delete-logs.controller';
import EditOwnerController from '../services/edit-owner/edit-owner.controller';

import GetAllTelemetryBoardsController from '../services/get-all-telemetry-boards/get-all-telemetry-boards.controller';
import GetUserTokenController from '../services/get-user-token/get-user-token.controller';
import ListLogsController from '../services/list-logs/list-logs.controller';
import ListOwnersController from '../services/list-owners/list-owners.controller';

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

adminsRoutes.post('/owners', CreateOwnerController.handle);

adminsRoutes.get('/owners', ListOwnersController.handle);

adminsRoutes.post(
  '/telemetry-boards',
  CreateTelemetryBoardController.validate,
  CreateTelemetryBoardController.handle,
);

adminsRoutes.patch('/owners/:ownerId', EditOwnerController.handle);

adminsRoutes.get('/telemetry-boards', GetAllTelemetryBoardsController.handle);

adminsRoutes.post('/owners/auth/:userId', GetUserTokenController.handle);

adminsRoutes.get('/logs', ListLogsController.handle);

adminsRoutes.delete('/logs', DeleteLogsController.handle);

export default adminsRoutes;
