import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateCounterTypeController from '../services/create-counter-type/create-counter-type.controller';
import EditCounterTypeController from '../services/edit-counter-type/edit-counter-type.controller';
import ListCounterTypesController from '../services/list-counter-types/list-counter-types.controller';

const counterTypesRouter = Router();

counterTypesRouter.use(authHandler);

counterTypesRouter.post(
  '/',
  celebrate({
    body: {
      label: Joi.string().required(),
      type: Joi.string().valid('IN', 'OUT').required(),
    },
  }),
  CreateCounterTypeController.handle,
);

counterTypesRouter.get('/', ListCounterTypesController.handle);

counterTypesRouter.patch(
  '/:counterTypeId',
  celebrate({
    body: {
      label: Joi.string().required(),
    },
    params: {
      counterTypeId: Joi.string().required(),
    },
  }),
  EditCounterTypeController.handle,
);

export default counterTypesRouter;
