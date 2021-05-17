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
      startDate: Joi.date(),
      endDate: Joi.date(),
      type: Joi.string().valid('IN', 'OUT'),
      limit: Joi.number(),
      offset: Joi.number(),
    },
  }),
  ListTelemetryLogsController.handle,
);

export default telemetryLogsRouter;
