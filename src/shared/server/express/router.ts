import adminsRoutes from '@modules/admins/routes/admins.routes';
import categoriesRoutes from '@modules/categories/routes/categories.routes';
import collectionsRoutes from '@modules/collections/routes/collections.routes';
import counterTypesRoutes from '@modules/counter-types/routes/counter-types.routes';
import groupsRoutes from '@modules/groups/routes/groups.routes';
import machinesRoutes from '@modules/machines/routes/machines.routes';
import pointsOfSaleRoutes from '@modules/points-of-sale/routes/points-of-sales.routes';
import productsRoutes from '@modules/products/routes/products.routes';
import reportsRoutes from '@modules/reports/routes/reports.routes';
import routesRoutes from '@modules/routes/routes/routes.routes';
import telemetryLogsRoutes from '@modules/telemetry-logs/routes/telemetry-logs.router';
import telemetryRoutes from '@modules/telemetry/routes/telemetry.routes';
import usersRoutes from '@modules/users/routes/users.routes';
import { Router } from 'express';

const router = Router();

router.use('/admins', adminsRoutes);
router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);
router.use('/pointsOfSale', pointsOfSaleRoutes);
router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/machines', machinesRoutes);
router.use('/routes', routesRoutes);
router.use('/counterTypes', counterTypesRoutes);
router.use('/telemetry-boards', telemetryRoutes);
router.use('/telemetry-logs', telemetryLogsRoutes);
router.use('/collections', collectionsRoutes);
router.use('/reports', reportsRoutes);

export default router;
