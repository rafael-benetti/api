import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import ListTelemetryLogsController from '../services/list-telemetry-logs/list-telemetry-logs.controller';

const telemetryLogsRouter = Router();

telemetryLogsRouter.use(authHandler);

telemetryLogsRouter.get(
  '/',
  celebrate({
    query: {
      machineId: Joi.string().required(),
      limit: Joi.number(),
      offset: Joi.number(),
    },
  }),
  ListTelemetryLogsController.handle,
);

export default telemetryLogsRouter;
