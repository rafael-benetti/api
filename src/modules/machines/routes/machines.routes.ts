import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateMachineController from '../services/create-machine/create-machine.controller';
import EditMachineController from '../services/edit-machine/edit-machine.controller';
import FixMachineStockController from '../services/fix-machine-stock/fix-machine-stock.controller';
import GetMachineDetailsController from '../services/get-machine-details/get-machine-details.controller';
import ListMachinesController from '../services/list-machines/list-machines.controller';

const machinesRouter = Router();

machinesRouter.use(authHandler);

machinesRouter.post(
  '/',
  celebrate({
    body: {
      serialNumber: Joi.string().required(),
      categoryId: Joi.string().required(),
      typeOfPrizeId: Joi.string().allow(null),
      minimumPrizeCount: Joi.number().allow(null),
      groupId: Joi.string().required(),
      gameValue: Joi.number().positive().required(),
      locationId: Joi.string().allow(null),
      operatorId: Joi.string().allow(null),
      telemetryBoardId: Joi.number().allow(null),
      incomePerMonthGoal: Joi.number().allow(null),
      incomePerPrizeGoal: Joi.number().allow(null),
      boxes: Joi.array().items(
        Joi.object({
          counters: Joi.array().items({
            counterTypeId: Joi.string().required(),
            hasMechanical: Joi.boolean().required(),
            hasDigital: Joi.boolean().required(),
            pin: Joi.string().required(),
          }),
        }),
      ),
    },
  }),
  CreateMachineController.handle,
);

machinesRouter.get(
  '/',
  celebrate({
    query: {
      categoryId: Joi.string(),
      groupId: Joi.string(),
      routeId: Joi.string(),
      pointOfSaleId: Joi.string().allow(null),
      serialNumber: Joi.string(),
      isActive: Joi.boolean().default(true),
      lean: Joi.boolean().default(false),
      telemetryStatus: Joi.string().valid(
        'ONLINE',
        'OFFLINE',
        'VIRGIN',
        'NO_TELEMETRY',
      ),
      limit: Joi.number(),
      offset: Joi.number(),
    },
  }),
  ListMachinesController.handle,
);

machinesRouter.get(
  '/:machineId',
  celebrate({
    query: {
      period: Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY').default('DAILY'),
    },
    params: {
      machineId: Joi.string().required(),
    },
  }),
  GetMachineDetailsController.handle,
);

machinesRouter.patch(
  '/:machineId/fix-stock',
  FixMachineStockController.validate,
  FixMachineStockController.handle,
);

machinesRouter.put(
  '/:machineId',
  celebrate({
    body: {
      serialNumber: Joi.string(),
      categoryId: Joi.string(),
      typeOfPrizeId: Joi.string().allow(null),
      minimumPrizeCount: Joi.number().allow(null),
      gameValue: Joi.number().positive(),
      locationId: Joi.string().allow(null),
      operatorId: Joi.string().allow(null),
      groupId: Joi.string(),
      isActive: Joi.boolean(),
      telemetryBoardId: Joi.number().allow(null),
      maintenance: Joi.boolean(),
      incomePerMonthGoal: Joi.number().allow(null),
      incomePerPrizeGoal: Joi.number().allow(null),
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
      machineId: Joi.string().required(),
    },
  }),
  EditMachineController.handle,
);

export default machinesRouter;
