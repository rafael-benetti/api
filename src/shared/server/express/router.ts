import adminsRoutes from '@modules/admins/routes/admins.routes';
import usersRoutes from '@modules/users/routes/users.routes';
import { Router } from 'express';

const router = Router();

router.use('/admins', adminsRoutes);
router.use('/users', usersRoutes);

export default router;
