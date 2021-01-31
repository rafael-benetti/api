import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { Router } from 'express';
import CompaniesController from '../controllers/CompaniesController';

const companiesRoutes = Router();

const companiesController = new CompaniesController();

companiesRoutes.use(ensureAuthentication);

companiesRoutes.post('/', companiesController.create);

export default companiesRoutes;
