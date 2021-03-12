import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreatePointOfSaleController from '../services/create-point-of-sale/create-point-of-sale.controller';
import EditPointOfSaleController from '../services/edit-point-of-sale/edit-point-of-sale.controller';

const pointsOfSaleRoutes = Router();

pointsOfSaleRoutes.use(authHandler);

pointsOfSaleRoutes.post(
  '/',
  celebrate(
    {
      body: {
        groupId: Joi.string().required(),
        label: Joi.string().required(),
        contactName: Joi.string().required(),
        primaryPhoneNumber: Joi.string().required(),
        secondaryPhoneNumber: Joi.string(),
        rent: Joi.number().positive().default(0),
        isPercentage: Joi.bool(),
        address: Joi.object({
          zipCode: Joi.string().required(),
          state: Joi.string().required(),
          city: Joi.string().required(),
          street: Joi.string().required(),
          neighborhood: Joi.string().required(),
          number: Joi.string().required(),
          extraInfo: Joi.string(),
        }).required(),
      },
    },
    { abortEarly: false },
  ),
  CreatePointOfSaleController.handle,
);

pointsOfSaleRoutes.patch(
  '/:pointOfSaleId',
  celebrate({
    body: {
      label: Joi.string(),
      contactName: Joi.string(),
      primaryPhoneNumber: Joi.string(),
      secondaryPhoneNumber: Joi.string(),
      rent: Joi.number().positive(),
      isPercentage: Joi.bool(),
      address: Joi.object({
        zipCode: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        neighborhood: Joi.string().required(),
        number: Joi.string().required(),
        extraInfo: Joi.string(),
      }),
    },
  }),
  EditPointOfSaleController.handle,
);

export default pointsOfSaleRoutes;
