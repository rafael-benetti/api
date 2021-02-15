import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CompaniesController from '../controllers/CompaniesController';

const companiesRoutes = Router();

const companiesController = new CompaniesController();

companiesRoutes.use(ensureAuthentication);

companiesRoutes.post(
  '/',
  celebrate({
    body: {
      name: Joi.string().max(150).required(),
    },
  }),
  companiesController.create,
);

companiesRoutes.put(
  '/',
  celebrate({
    body: {
      name: Joi.string().required(),
    },
    query: {
      companyId: Joi.number().required(),
    },
  }),
  companiesController.update,
);

export default companiesRoutes;
