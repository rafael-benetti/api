import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import SessionsController from '../services/create-user-session/authentication-user-controller';

const sessionsRoutes = Router();

const sessionsController = new SessionsController();

sessionsRoutes.post(
  '/',
  celebrate({
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

export default sessionsRoutes;
