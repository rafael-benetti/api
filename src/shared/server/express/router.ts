import groupsRoutes from '@modules/groups/routes/groups-routes';
import pointsOfSaleRoutes from '@modules/points-of-sale/routes/points-of-sale.routes';
import sessionsRoutes from '@modules/users/routes/sessions-routes';
import usersRoutes from '@modules/users/routes/users-routes';
import adminsRoutes from '@modules/admins/routes/admins.routes';
import { Router } from 'express';
import machinesRoutes from '@modules/machines/routes/machines.routes';
import machineCategoriesRoutes from '@modules/machine-categories/routes/machine-categories.routes';
import routesRoutes from '@modules/routes/routes/routes.routes';

const router = Router();

router.use('/sessions', sessionsRoutes);
router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);
router.use('/pointsOfSale', pointsOfSaleRoutes);
router.use('/admins', adminsRoutes);
router.use('/machines', machinesRoutes);
router.use('/machineCategories', machineCategoriesRoutes);
router.use('/routes', routesRoutes);

export default router;
