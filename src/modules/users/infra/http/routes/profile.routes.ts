import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';

const profileRoutes = Router();

const profileController = new ProfileController();

profileRoutes.use(ensureAuthentication);

profileRoutes.get('/', profileController.show);

profileRoutes.patch(
  '/',
  celebrate({
    body: {
      name: Joi.string(),
      phone: Joi.string().min(10).max(11),
      password: Joi.string().regex(/^(?=.*[A-z])(?=.*[0-9])(?=.{1,})/),
    },
  }),
  profileController.update,
);

export default profileRoutes;
