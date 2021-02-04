import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import TransferProductsController from '../controllers/TransferProductsController';

const transferProductsRouter = Router();

const productToUser = new TransferProductsController();

transferProductsRouter.use(ensureAuthentication);

transferProductsRouter.post(
  '/transfer',
  celebrate({
    body: {
      targetUserId: Joi.number().required(),
      quantity: Joi.number().positive().required(),
      productId: Joi.number().required(),
    },
  }),
  productToUser.create,
);

export default transferProductsRouter;
