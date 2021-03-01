import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreatePointOfSaleController from '../services/create-point-of-sale/create-point-of-sale-controller';

const pointsOfSalesRoutes = Router();

const createPointOfSaleController = new CreatePointOfSaleController();

pointsOfSalesRoutes.use(authHandler);

pointsOfSalesRoutes.post(
  '/',
  celebrate({
    body: {
      label: Joi.string().required(),
      contactName: Joi.string().required(),
      primaryPhoneNumber: Joi.string().required(),
      secondaryPhoneNumber: Joi.string().optional(),
      groupId: Joi.string().required(),
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

export default pointsOfSalesRoutes;
