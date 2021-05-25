import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateNotificationController from '../services/craete-notification/create-notification.controller';
import ListNotificationsController from '../services/list-notifications/list-notifications.controller';

// TODO: ADICIONAR FUNÇÃO DE AUTENTICAÇÃO

const notificationsRouter = Router();

notificationsRouter.post(
  '/',
  celebrate({
    body: {
      topic: Joi.string(),
      machineId: Joi.string(),
      groupId: Joi.string().required(),
      title: Joi.string().required(),
      body: Joi.string().required(),
    },
  }),
  CreateNotificationController.handle,
);

notificationsRouter.use(authHandler);

notificationsRouter.get('/', ListNotificationsController.handle);

export default notificationsRouter;
