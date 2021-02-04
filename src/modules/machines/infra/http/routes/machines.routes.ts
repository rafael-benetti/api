import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import MachinesController from '../controllers/MachinesController';

const machinesRoutes = Router();

const machinesController = new MachinesController();

machinesRoutes.use(ensureAuthentication);

machinesRoutes.post(
  '/',
  celebrate({
    body: {
      serialNumber: Joi.string().required(),
      description: Joi.string().required(),
      gameValue: Joi.number().required(),
      companyId: Joi.number().required(),
    },
  }),
  machinesController.create,
);

machinesRoutes.get(
  '/',
  celebrate({
    query: {
      name: Joi.string(),
      isActive: Joi.string().valid('false', 'true'),
      companyId: Joi.number().positive(),
      limit: Joi.number(),
      page: Joi.number(),
    },
  }),
  machinesController.index,
);

export default machinesRoutes;
