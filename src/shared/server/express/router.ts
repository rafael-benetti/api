import adminsRoutes from '@modules/admins/routes/admins.routes';
import groupsRoutes from '@modules/groups/routes/groups.routes';
import usersRoutes from '@modules/users/routes/users.routes';
import { Router } from 'express';

const router = Router();

router.use('/admins', adminsRoutes);
router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);

export default router;
