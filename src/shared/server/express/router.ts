import { Router } from 'express';

import usersRoutes from '@modules/users/routes/users-routes';
import sessionsRoutes from '@modules/users/routes/sessions-routes';
import groupsRoutes from '@modules/groups/routes/groups-routes';

const router = Router();

router.use('/sessions', sessionsRoutes);
router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);

export default router;
