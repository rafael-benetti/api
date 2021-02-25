import { Router } from 'express';
import CreateOwnerController from '../services/createOwner/CreateOwner.controller';

const ownerRoutes = Router();

const createOwnerController = new CreateOwnerController();

ownerRoutes.post('/', createOwnerController.handle);

export default ownerRoutes;
