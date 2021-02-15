import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import MachineCategoriesController from '../controllers/MachineCategoriesController';

const machineCategoriesRoutes = Router();

const machineCategoriesController = new MachineCategoriesController();

machineCategoriesRoutes.use(ensureAuthentication);

machineCategoriesRoutes.post(
  '/',
  celebrate({
    body: {
      name: Joi.string().required(),
    },
  }),
  machineCategoriesController.create,
);

machineCategoriesRoutes.get(
  '/:machineCategoryId',
  celebrate({
    params: {
      machineCategoryId: Joi.string().required(),
    },
  }),
  machineCategoriesController.show,
);

machineCategoriesRoutes.put(
  '/',
  celebrate({
    body: {
      name: Joi.string().required(),
    },
    query: {
      machineCategoryId: Joi.number().required(),
    },
  }),
  machineCategoriesController.update,
);

machineCategoriesRoutes.get('/', machineCategoriesController.index);

export default machineCategoriesRoutes;
