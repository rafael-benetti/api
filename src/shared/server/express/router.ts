import { Router } from 'express';
import usersRoutes from '@modules/users/infra/http/routes/user.routes';
import companiesRoutes from '@modules/companies/infra/http/routes/company.routes';

const router = Router();

router.use('/users', usersRoutes);

router.use('/companies', companiesRoutes);

export default router;
