import authHandler from '@shared/server/express/middlewares/auth-handler';
import { Router } from 'express';
import CreateMachineController from '../services/create-machine.controller';

const machinesRoutes = Router();

machinesRoutes.use(authHandler);

machinesRoutes.post('/', CreateMachineController.handle);

export default machinesRoutes;
