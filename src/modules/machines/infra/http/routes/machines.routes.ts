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
      description: Joi.string(),
      gameValue: Joi.number().required(),
      companyId: Joi.number().required(),
      sellingPointId: Joi.number().required(),
      machineCategoryId: Joi.number().required(),
      counters: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          slot: Joi.number().required(),
          groups: Joi.string(),
          hasDigital: Joi.number().required(),
          hasMechanical: Joi.number().required(),
          pin: Joi.number().required(),
          pulseValue: Joi.number().required(),
          typeId: Joi.number().required(),
        }),
      ),
    },
  }),
  machinesController.create,
);

machinesRoutes.patch(
  '/',
  celebrate({
    body: {
      serialNumber: Joi.string().required(),
      description: Joi.string(),
      gameValue: Joi.number().required(),
      companyId: Joi.number().required(),
      sellingPointId: Joi.number().required(),
      machineCategoryId: Joi.number(),
      counters: Joi.array().items(
        Joi.object().keys({
          id: Joi.number().optional(),
          name: Joi.string().required(),
          groups: Joi.string(),
          slot: Joi.number().required(),
          hasDigital: Joi.number().required(),
          hasMechanical: Joi.number().required(),
          pin: Joi.number().required(),
          pulseValue: Joi.number().required(),
          typeId: Joi.number().required(),
          machineId: Joi.number().optional(),
        }),
      ),
    },
    query: {
      machineId: Joi.number().required(),
    },
  }),
  machinesController.update,
);

machinesRoutes.get(
  '/',
  celebrate({
    query: {
      keywords: Joi.string(),
      isActive: Joi.string().valid('false', 'true'),
      companyId: Joi.number().positive(),
      limit: Joi.number().optional(),
      page: Joi.number().optional(),
      machineCategoryId: Joi.number().positive().optional(),
    },
  }),
  machinesController.index,
);

export default machinesRoutes;
