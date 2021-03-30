import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateCategoryController from '../services/create-category/create-category.controller';
import EditCategoryController from '../services/edit-category/edit-category.controller';
import ListCategoriesController from '../services/list-categories/list-categories.controller';

const categoriesRouter = Router();

categoriesRouter.use(authHandler);

categoriesRouter.post(
  '/',
  celebrate({
    body: {
      label: Joi.string().required(),
      boxes: Joi.array().items({
        id: Joi.string(),
        counters: Joi.array().items({
          counterTypeId: Joi.string().required(),
          hasMechanical: Joi.boolean().required(),
          hasDigital: Joi.boolean().required(),
          pin: Joi.string().required(),
        }),
      }),
    },
  }),
  CreateCategoryController.handle,
);
categoriesRouter.get('/', ListCategoriesController.handle);

categoriesRouter.put(
  '/:categoryId',
  celebrate({
    body: {
      label: Joi.string(),
      boxes: Joi.array().items({
        id: Joi.string(),
        counters: Joi.array().items({
          counterTypeId: Joi.string().required(),
          hasMechanical: Joi.boolean().required(),
          hasDigital: Joi.boolean().required(),
          pin: Joi.string().required(),
        }),
      }),
    },
    params: {
      categoryId: Joi.string().required(),
    },
  }),
  EditCategoryController.handle,
);

export default categoriesRouter;
