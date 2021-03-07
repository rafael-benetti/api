import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreatePointOfSaleController from '../services/create-point-of-sale/create-point-of-sale-controller';
import ListPointsOfSaleController from '../services/list-points-of-sale/list-points-of-sale.controller';

const pointsOfSaleRoutes = Router();

const createPointOfSaleController = new CreatePointOfSaleController();

pointsOfSaleRoutes.use(authHandler);

pointsOfSaleRoutes.post(
  '/',
  celebrate({
    body: {
      label: Joi.string().required(),
      contactName: Joi.string().required(),
      primaryPhoneNumber: Joi.string().required(),
      secondaryPhoneNumber: Joi.string().optional(),
      groupId: Joi.string().required(),
      routeId: Joi.string(),
      address: Joi.object({
        zipCode: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        street: Joi.string().required(),
        neighborhood: Joi.string().required(),
        number: Joi.string().required(),
        extraInfo: Joi.string().optional(),
      }),
    },
  }),
  createPointOfSaleController.handle,
);

pointsOfSaleRoutes.get('/', ListPointsOfSaleController.handle);

export default pointsOfSaleRoutes;
