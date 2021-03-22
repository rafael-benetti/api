import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateMachineController from '../services/create-machine/create-machine.controller';
import EditMachineController from '../services/edit-machine/edit-machine.controller';
import ListMachinesController from '../services/list-machines/list-machines.controller';

const machinesRouter = Router();

machinesRouter.use(authHandler);

machinesRouter.post(
  '/',
  celebrate({
    body: {
      serialNumber: Joi.string().required(),
      categoryId: Joi.string().required(),
      groupId: Joi.string().required(),
      gameValue: Joi.number().positive().required(),
      locationId: Joi.string(),
      operatorId: Joi.string(),
      boxes: Joi.array().items({
        counters: Joi.array().items({
          label: Joi.string().required(),
          type: Joi.string().valid('IN', 'OUT').required(),
          hasMechanical: Joi.boolean().required(),
          hasDigital: Joi.boolean().required(),
          pin: Joi.string().required(),
        }),
      }),
    },
  }),
  CreateMachineController.handle,
);

machinesRouter.get('/', ListMachinesController.handle);

machinesRouter.put(
  '/:machineId',
  celebrate({
    body: {
      serialNumber: Joi.string(),
      categoryId: Joi.string(),
      gameValue: Joi.number().positive(),
      locationId: Joi.string(),
      operatorId: Joi.string(),
      groupId: Joi.string(),
      boxes: Joi.array().items({
        id: Joi.string(),
        counters: Joi.array().items({
          label: Joi.string().required(),
          type: Joi.string().valid('IN', 'OUT').required(),
          hasMechanical: Joi.boolean().required(),
          hasDigital: Joi.boolean().required(),
          pin: Joi.string().required(),
        }),
      }),
    },
    params: {
      machineId: Joi.string().required(),
    },
  }),
  EditMachineController.handle,
);

export default machinesRouter;
