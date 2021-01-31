import { Router } from 'express';
import CompaniesController from '../controllers/CompaniesController';

const companiesRoutes = Router();

const companiesController = new CompaniesController();

companiesRoutes.post('/', companiesController.create);

export default companiesRoutes;
