import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateMachineCategoryController from '../services/create-machine-category/create-machine-category.controller';
import ListMachineCategoriesController from '../services/list-machine-categories/list-machine-categories.controller';
import ListMachineCategoriesService from '../services/list-machine-categories/list-machine-categories.service';

const machineCategoriesRoutes = Router();

machineCategoriesRoutes.use(authHandler);

machineCategoriesRoutes.post(
  '/',
  celebrate({
    body: {
      label: Joi.string().required(),
    },
  }),
  CreateMachineCategoryController.handle,
);

machineCategoriesRoutes.get('/', ListMachineCategoriesController.handle);
