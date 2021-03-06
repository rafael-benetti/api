import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import AddToStockController from '../services/add-to-stock/add-to-stock.controller.ts';
import CreateProductController from '../services/create-product/create-product.controller';
import DeleteProductController from '../services/delete-product/delete-product.controller';
import RemoveFromMachineController from '../services/remove-from-machine/remove-from-machine.controller';
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
        quantity: Joi.number().integer().default(0),
        cost: Joi.number().default(0),
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
        cost: Joi.number().required(),
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
      productType: Joi.string().valid('PRIZE', 'SUPPLY').required(),
      productQuantity: Joi.number().integer().required(),
      cost: Joi.number(),
      from: {
        id: Joi.string().uuid().required(),
        type: Joi.string().valid('GROUP', 'USER').required(),
      },
      to: Joi.object({
        id: Joi.string().uuid().required(),
        type: Joi.string().valid('GROUP', 'USER', 'MACHINE').required(),
        boxId: Joi.when('type', {
          is: 'MACHINE',
          then: Joi.string().required(),
          otherwise: Joi.forbidden(),
        }),
      }).required(),
    },
  }),
  TransferProductController.handle,
);

productsRoutes.patch(
  '/:productId/remove-from-machine',
  RemoveFromMachineController.validate,
  RemoveFromMachineController.handle,
);

productsRoutes.delete(
  '/:productId',
  celebrate({
    body: {
      productType: Joi.string().valid('PRIZE', 'SUPPLY').required(),
      from: {
        id: Joi.string().uuid().required(),
        type: Joi.string().valid('GROUP', 'USER').required(),
      },
    },
  }),
  DeleteProductController.handle,
);

export default productsRoutes;
