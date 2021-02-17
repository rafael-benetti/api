import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { Router } from 'express';
import multer from 'multer';
import multerConfig from '@config/multer';
import MachineCollectionController from '../controllers/MachineConllectionController';

const machineCollectionRoutes = Router();

const machineCollectionController = new MachineCollectionController();

const upload = multer(multerConfig);

machineCollectionRoutes.use(ensureAuthentication);

machineCollectionRoutes.post(
  '/collection/:machineId',
  upload.array('photos', 13),
  machineCollectionController.create,
);

machineCollectionRoutes.get('/collection', machineCollectionController.index);

export default machineCollectionRoutes;
