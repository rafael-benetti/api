import { Router } from 'express';
import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import companiesRoutes from '@modules/companies/infra/http/routes/company.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import productsRoutes from '@modules/products/infra/http/routes/products.routes';
import transferProductsRoutes from '@modules/products/infra/http/routes/transfer_products.routes';

const router = Router();

router.use('/users', usersRoutes);

router.use('/companies', companiesRoutes);

router.use('/sessions', sessionsRoutes);

router.use('/products', productsRoutes);

router.use('/products', transferProductsRoutes);

export default router;
