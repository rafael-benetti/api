import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { Router } from 'express';
import MachineCollectionController from '../controllers/MachineConllectionController';

const machineCollectionRoutes = Router();

const machineCollectionController = new MachineCollectionController();

machineCollectionRoutes.use(ensureAuthentication);

machineCollectionRoutes.post('/collection', machineCollectionController.create);

export default machineCollectionRoutes;
