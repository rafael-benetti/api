import { Router } from 'express';
import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import companiesRoutes from '@modules/companies/infra/http/routes/company.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import productsRoutes from '@modules/products/infra/http/routes/products.routes';
import transferProductsRoutes from '@modules/products/infra/http/routes/transfer_products.routes';
import machinesRoutes from '@modules/machines/infra/http/routes/machines.routes';
import machineCategoriesRoutes from '@modules/machines/infra/http/routes/machieCategories.routes';
import countersRoutes from '@modules/counters/infra/http/routes/counters.routes';
import sellingPointRoutes from '@modules/sellingPoints/infra/http/routes/sellingPoints.routes';

const router = Router();

router.use('/users', usersRoutes);

router.use('/companies', companiesRoutes);

router.use('/sessions', sessionsRoutes);

router.use('/products', productsRoutes);

router.use('/products', transferProductsRoutes);

router.use('/machines', machinesRoutes);

router.use('/machine-categories', machineCategoriesRoutes);

router.use('/counters', countersRoutes);

router.use('/selling-points', sellingPointRoutes);

export default router;
