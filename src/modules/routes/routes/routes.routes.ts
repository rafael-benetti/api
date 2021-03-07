import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateRouteController from '../services/create-route/create-route.controller';
import ListRoutesController from '../services/list-routes/list-routes.controller';

const routesRoutes = Router();

routesRoutes.use(authHandler);

routesRoutes.post(
  '/',
  celebrate({
    body: {
      label: Joi.string().required(),
      groupIds: Joi.array().items(Joi.string()),
      operatorId: Joi.string(),
    },
  }),
  CreateRouteController.handle,
);

routesRoutes.get('/', ListRoutesController.handle);

export default routesRoutes;
