import { Router } from 'express';
import usersRoutes from '@modules/users/infra/http/routes/user.routes';

const router = Router();

router.use('/users', usersRoutes);

export default router;
