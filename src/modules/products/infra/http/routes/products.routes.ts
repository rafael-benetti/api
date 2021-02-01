import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { Router } from 'express';
import ProductsController from '../controllers/ProductsController';

const productsRoutes = Router();

const productsController = new ProductsController();

productsRoutes.use(ensureAuthentication);

productsRoutes.post('/', productsController.create);
productsRoutes.get('/', productsController.index);

export default productsRoutes;
