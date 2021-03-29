import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateRouteController from '../services/create-route/create-route.controller';
import EditRouteController from '../services/edit-route/edit-route.controller';
import ListRoutesController from '../services/list-routes/list-routes.controller';

const routesRouter = Router();

routesRouter.use(authHandler);

routesRouter.post(
  '/',
  celebrate({
    body: {
      label: Joi.string().required(),
      machineIds: Joi.array().items(Joi.string()).min(1).required(),
      operatorId: Joi.string(),
    },
  }),
  CreateRouteController.handle,
);

routesRouter.get('/', ListRoutesController.handle);

routesRouter.put(
  '/:routeId',
  celebrate({
    body: {
      label: Joi.string(),
      machineIds: Joi.array().items(Joi.string()).allow(null),
      operatorId: Joi.string().allow(null),
    },
  }),
  EditRouteController.handle,
);

export default routesRouter;
