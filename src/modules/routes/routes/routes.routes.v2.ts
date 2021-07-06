import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import ListRoutesControllerV2 from '../services/list-routes/list-routes.controller.v2';

const routesRouterV2 = Router();

routesRouterV2.use(authHandler);

routesRouterV2.get(
  '/',
  celebrate({
    query: {
      limit: Joi.number(),
      offset: Joi.number(),
      groupId: Joi.string().uuid(),
      operatorId: Joi.string().uuid(),
      pointOfSaleId: Joi.string().uuid(),
      label: Joi.string(),
    },
  }),
  ListRoutesControllerV2.handle,
);

export default routesRouterV2;
