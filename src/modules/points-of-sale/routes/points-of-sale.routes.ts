import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreatePointOfSaleController from '../services/create-point-of-sale/create-point-of-sale-controller';
import EditPointOfSaleController from '../services/edit-point-of-sale/edit-point-of-sale.controller';
import ListPointsOfSaleController from '../services/list-points-of-sale/list-points-of-sale.controller';

const pointsOfSaleRoutes = Router();

pointsOfSaleRoutes.use(authHandler);

pointsOfSaleRoutes.post(
  '/',
  celebrate({
    body: {
      label: Joi.string().required(),
      contactName: Joi.string().optional(),
      primaryPhoneNumber: Joi.string().optional(),
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
  CreatePointOfSaleController.handle,
);

pointsOfSaleRoutes.get('/', ListPointsOfSaleController.handle);

pointsOfSaleRoutes.put(
  '/',
  celebrate({
    body: {
      label: Joi.string().optional(),
      contactName: Joi.string().allow(null).optional(),
      primaryPhoneNumber: Joi.string().allow(null).optional(),
      secondaryPhoneNumber: Joi.string().allow(null).optional(),
      extraInfo: Joi.string().allow(null).optional(),
    },
    query: {
      pointOfSaleId: Joi.string().required(),
    },
  }),
  EditPointOfSaleController.handle,
);

export default pointsOfSaleRoutes;
