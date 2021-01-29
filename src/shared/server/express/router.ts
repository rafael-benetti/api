import { Router } from 'express';
import errorHandler from './middlewares/error-handler';

const router = Router();

router.use(errorHandler);

export default router;
