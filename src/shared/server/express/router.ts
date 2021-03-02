import groupsRoutes from '@modules/groups/routes/groups-routes';
import pointsOfSalesRoutes from '@modules/points-of-sale/routes/points-of-sale.routes';
import sessionsRoutes from '@modules/users/routes/sessions-routes';
import usersRoutes from '@modules/users/routes/users-routes';
import adminsRouter from '@modules/admins/routes/admins.routes';
import { Router } from 'express';
import machinesRoutes from '@modules/machines/routes/machines.routes';

const router = Router();

router.use('/sessions', sessionsRoutes);
router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);
router.use('/pointsOfSale', pointsOfSalesRoutes);
router.use('/admins', adminsRouter);
router.use('/machines', machinesRoutes);

export default router;
