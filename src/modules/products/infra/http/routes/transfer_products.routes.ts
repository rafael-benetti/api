import { Router } from 'express';
import TransferProductsController from '../controllers/TransferProductsController';

const transferProductsRouter = Router();

const productToUser = new TransferProductsController();

transferProductsRouter.post('/transfer', productToUser.create);

export default transferProductsRouter;
