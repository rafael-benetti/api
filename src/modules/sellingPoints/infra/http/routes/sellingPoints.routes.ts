import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { Router } from 'express';
import SellingPointsController from '../controllers/SellingPointsController';

const sellingPointRoutes = Router();

const sellingPointsController = new SellingPointsController();

sellingPointRoutes.use(ensureAuthentication);

sellingPointRoutes.post('/', sellingPointsController.create);

sellingPointRoutes.get('/', sellingPointsController.index);

export default sellingPointRoutes;
