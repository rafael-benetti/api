import { Router } from 'express';
import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import companiesRoutes from '@modules/companies/infra/http/routes/company.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';

const router = Router();

router.use('/users', usersRoutes);

router.use('/companies', companiesRoutes);

router.use('/sessions', sessionsRoutes);

export default router;
