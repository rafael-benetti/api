import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import SellingPointsController from '../controllers/SellingPointsController';

const sellingPointRoutes = Router();

const sellingPointsController = new SellingPointsController();

sellingPointRoutes.use(ensureAuthentication);

sellingPointRoutes.post(
  '/',
  celebrate({
    body: {
      name: Joi.string().required(),
      companyId: Joi.number().required(),
      responsible: Joi.string().required(),
      phone1: Joi.string().required(),
      phone2: Joi.string().required(),
      address: {
        zipCode: Joi.string().max(8).min(8).required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        neighborhood: Joi.string().required(),
        street: Joi.string().required(),
        number: Joi.number().required(),
        note: Joi.string(),
      },
    },
  }),
  sellingPointsController.create,
);

sellingPointRoutes.patch(
  '/',
  celebrate({
    body: {
      name: Joi.string().required(),
      companyId: Joi.number().required(),
      responsible: Joi.string().required(),
      phone1: Joi.string().required(),
      phone2: Joi.string().required(),
      address: {
        zipCode: Joi.string().max(8).min(8).required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        neighborhood: Joi.string().required(),
        street: Joi.string().required(),
        number: Joi.number().required(),
        note: Joi.string(),
      },
    },
    query: {
      sellingPointId: Joi.number().required(),
    },
  }),
  sellingPointsController.update,
);

sellingPointRoutes.get('/', sellingPointsController.index);

export default sellingPointRoutes;
