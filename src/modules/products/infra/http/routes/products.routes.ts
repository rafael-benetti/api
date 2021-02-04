import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import ProductsController from '../controllers/ProductsController';

const productsRoutes = Router();

const productsController = new ProductsController();

productsRoutes.use(ensureAuthentication);

productsRoutes.post(
  '/',
  celebrate({
    body: {
      name: Joi.string().required(),
      cost: Joi.number().positive().required(),
      price: Joi.number().positive(),
      quantity: Joi.number().positive().required(),
    },
  }),
  productsController.create,
);
productsRoutes.get('/', productsController.index);

export default productsRoutes;
