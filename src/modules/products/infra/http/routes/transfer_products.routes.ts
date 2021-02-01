import { Router } from 'express';
import ProductToUserController from '../controllers/ProductToUSerController';

const transferProductsRouter = Router();

const productToUser = new ProductToUserController();

transferProductsRouter.post('/transfer', productToUser.create);

export default transferProductsRouter;
