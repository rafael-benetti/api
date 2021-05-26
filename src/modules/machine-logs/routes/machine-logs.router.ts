import authHandler from '@shared/server/express/middlewares/auth-handler';
import { Router } from 'express';
import ListMachineLogsController from '../services/list-machine-logs/list-machine-logs.controller';
import RemoteCreditController from '../services/remote-credit/remote-credit.controller';

const machineLogsRouter = Router();

machineLogsRouter.use(authHandler);

machineLogsRouter.get(
  '/',
  ListMachineLogsController.validate,
  ListMachineLogsController.handle,
);

machineLogsRouter.post('/:machineId', RemoteCreditController.handle);

export default machineLogsRouter;
