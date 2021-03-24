import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import AddToStockController from '../services/add-to-stock/add-to-stock.controller.ts';
import CreateProductController from '../services/create-product/create-product.controller';
import TransferProductController from '../services/transfer-product/transfer-product.controller';

const productsRoutes = Router();

productsRoutes.use(authHandler);

productsRoutes.post(
  '/',
  celebrate(
    {
      body: {
        groupId: Joi.string().uuid().required(),
        label: Joi.string().required(),
        type: Joi.string().valid('PRIZE', 'SUPPLY').required(),
        quantity: Joi.number().positive().integer(),
        cost: Joi.number().positive(),
      },
    },
    { abortEarly: false },
  ),
  CreateProductController.handle,
);

productsRoutes.post(
  '/:productId/add-to-stock',
  celebrate(
    {
      body: {
        groupId: Joi.string().uuid().required(),
        quantity: Joi.number().integer().required(),
        type: Joi.string().valid('PRIZE', 'SUPPLY').required(),
        cost: Joi.number().positive().required(),
      },
    },
    { abortEarly: false },
  ),
  AddToStockController.handle,
);

productsRoutes.post(
  '/:productId/transfer',
  celebrate({
    body: {
      groupId: Joi.string().uuid(),
      productType: Joi.string().valid('PRIZE', 'SUPPLY').required(),
      productQuantity: Joi.number().integer().required(),
      cost: Joi.number(),
      to: Joi.object({
        id: Joi.string().uuid().required(),
        type: Joi.string().valid('GROUP', 'USER').required(),
      }).required(),
    },
  }),
  TransferProductController.handle,
);

export default productsRoutes;
