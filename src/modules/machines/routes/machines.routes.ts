import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateMachineController from '../services/create-machine/create-machine.controller';
import DeleteMachineController from '../services/delete-machine/delete-machine.controller';

const machinesRoutes = Router();

machinesRoutes.use(authHandler);

machinesRoutes.post(
  '/',
  celebrate({
    body: {
      serialNumber: Joi.string().required(),
      categoryId: Joi.string().required(),
      groupId: Joi.string().required(),
      pointOfSaleId: Joi.string().optional(),
    },
  }),
  CreateMachineController.handle,
);

machinesRoutes.delete('/:machineId', DeleteMachineController.handle);

export default machinesRoutes;
