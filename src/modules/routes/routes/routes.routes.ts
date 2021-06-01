import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateRouteController from '../services/create-route/create-route.controller';
import DeleteRouteController from '../services/delete-route/delete-route.controller';
import DetailRouteController from '../services/detail-route/detail-route.controller';
import EditRouteController from '../services/edit-route/edit-route.controller';
import ListRoutesController from '../services/list-routes/list-routes.controller';

const routesRouter = Router();

routesRouter.use(authHandler);

routesRouter.post(
  '/',
  celebrate({
    body: {
      label: Joi.string().required(),
      pointsOfSaleIds: Joi.array().items(Joi.string()).min(1),
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
      pointsOfSaleIds: Joi.array().items(Joi.string()).allow(null),
      operatorId: Joi.string().allow(null),
    },
  }),
  EditRouteController.handle,
);

routesRouter.get(
  '/:routeId',
  celebrate({
    params: {
      routeId: Joi.string(),
    },
    query: {
      period: Joi.string().valid('DAILY', 'MONTHLY', 'WEEKLY'),
      startDate: Joi.date(),
      endDate: Joi.date(),
    },
  }),

  DetailRouteController.handle,
);

routesRouter.delete(
  '/:routeId',
  celebrate({
    params: {
      routeId: Joi.string(),
    },
  }),
  DeleteRouteController.handle,
);

export default routesRouter;
