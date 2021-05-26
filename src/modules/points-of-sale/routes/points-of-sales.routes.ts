import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreatePointOfSaleController from '../services/create-point-of-sale/create-point-of-sale.controller';
import EditPointOfSaleController from '../services/edit-point-of-sale/edit-point-of-sale.controller';
import GetPointOfSaleDetailsController from '../services/get-point-of-sale-details/get-point-of-sale-details.controller';
import ListPointsOfSaleController from '../services/list-points-of-sale/list-points-of-sale.controller';

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
        primaryPhoneNumber: Joi.string().min(14).max(15).required(),
        secondaryPhoneNumber: Joi.string().min(14).max(15),
        rent: Joi.number().greater(-1),
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
      primaryPhoneNumber: Joi.string().min(14).max(15),
      secondaryPhoneNumber: Joi.string().min(14).max(15),
      rent: Joi.number().greater(-1),
      isPercentage: Joi.bool(),
      address: Joi.object({
        extraInfo: Joi.string(),
      }),
    },
  }),
  EditPointOfSaleController.handle,
);

pointsOfSaleRoutes.get('/', ListPointsOfSaleController.handle);

pointsOfSaleRoutes.get(
  '/:pointOfSaleId',
  celebrate({
    query: {
      period: Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY'),
      startDate: Joi.date(),
      endDate: Joi.date(),
    },
    params: {
      pointOfSaleId: Joi.string().required(),
    },
  }),
  GetPointOfSaleDetailsController.handle,
);

export default pointsOfSaleRoutes;
