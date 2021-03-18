import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateProductController from '../services/create-product/create-product.controller';

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
      },
    },
    { abortEarly: false },
  ),
  CreateProductController.handle,
);

export default productsRoutes;
