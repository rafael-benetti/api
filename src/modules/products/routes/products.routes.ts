import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateProductController from '../services/create-product/create-product.controller';
import EditProductController from '../services/edit-product/edit-product.controller';
import TransferProductController from '../services/transfer-product/transfer-product.controller';

const productsRoutes = Router();

productsRoutes.use(authHandler);

productsRoutes.post(
  '/',
  celebrate({
    body: {
      groupId: Joi.string().uuid().required(),
      label: Joi.string().required(),
      productType: Joi.string().valid('MACHINE', 'PRIZE', 'SUPPLY').required(),
    },
  }),
  CreateProductController.handle,
);

productsRoutes.put(
  '/:productId',
  celebrate({
    body: {
      groupId: Joi.string().uuid().required(),
      label: Joi.string(),
      quantityDifference: Joi.number(),
    },
  }),
  EditProductController.handle,
);

productsRoutes.patch(
  '/:productId/transfer',
  celebrate({
    body: {
      groupId: Joi.string().uuid().required(),
      targetGroupId: Joi.string().uuid().required(),
      quantityDifference: Joi.number(),
    },
  }),
  TransferProductController.handle,
);

export default productsRoutes;
