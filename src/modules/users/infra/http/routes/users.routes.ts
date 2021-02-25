import { Router } from 'express';
import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { celebrate, Joi } from 'celebrate';
import multer from 'multer';
import multerConfig from '@config/multer';
import UsersController from '../controllers/UsersController';
import 'express-async-errors';
import ProfileController from '../controllers/ProfileController';

const usersRoutes = Router();

const usersController = new UsersController();

const profileController = new ProfileController();

const upload = multer(multerConfig);

usersRoutes.use(ensureAuthentication);

usersRoutes.post(
  '/',
  celebrate({
    body: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(10).max(11).required(),
      password: Joi.string()
        .regex(/^(?=.*[A-z])(?=.*[0-9])(?=.{1,})/)
        .required(),
      isActive: Joi.number().valid(0, 1).required(),
      isOperator: Joi.number().valid(0, 1),
      roles: Joi.string(),
      ownerId: Joi.number(),
      companyIds: Joi.array()
        .items(Joi.number().positive().integer())
        .default([]),
    },
  }),
  usersController.create,
);

usersRoutes.patch(
  '/',
  celebrate({
    body: {
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string().min(10).max(11),
      password: Joi.string().regex(/^(?=.*[A-z])(?=.*[0-9])(?=.{1,})/),
      isActive: Joi.number().valid(0, 1),
      isOperator: Joi.number().valid(0, 1),
      roles: Joi.string(),
      ownerId: Joi.number(),
      companyIds: Joi.array()
        .items(Joi.number().positive().integer())
        .default([]),
    },
  }),
  usersController.update,
);

usersRoutes.get('/', usersController.index);

usersRoutes.get('/me', profileController.show);

usersRoutes.patch(
  '/me',
  upload.single('picture'),
  celebrate({
    body: {
      name: Joi.string(),
      phone: Joi.string().min(10).max(11),
      oldPassword: Joi.string(),
      password: Joi.string().regex(/^(?=.*[A-z])(?=.*[0-9])(?=.{1,})/),
    },
  }),
  profileController.update,
);

export default usersRoutes;
