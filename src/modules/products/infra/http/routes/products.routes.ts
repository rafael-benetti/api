import { Router } from 'express';
import ProductsController from '../controllers/ProductsController';

const productsRoutes = Router();

const productsController = new ProductsController();

productsRoutes.post('/', productsController.create);

export default productsRoutes;
