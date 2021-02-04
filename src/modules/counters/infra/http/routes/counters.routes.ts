import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CountersController from '../controllers/CountersController';

const countersRoutes = Router();

const countersController = new CountersController();

countersRoutes.use(ensureAuthentication);

countersRoutes.post('/', countersController.create);

countersRoutes.get(
  '/:machineId',
  celebrate({
    params: {
      machineId: Joi.number().required(),
    },
  }),
  countersController.index,
);

export default countersRoutes;
