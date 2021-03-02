import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';
import CreateUserController from '../services/create-user/create-user-controller';
import EditProfileController from '../services/edit-profile/edit-profile.controller';
import EditUserController from '../services/edit-user/edit-user-controller';
import GetProfileController from '../services/get-profile/get-profile-controller';
import ListUsersController from '../services/list-users/list-users-controller';

const userRoutes = Router();

userRoutes.use(authHandler);

userRoutes.post(
  '/',
  celebrate({
    body: {
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      phone: Joi.string().min(10).max(11).optional(),
      password: Joi.string()
        .regex(/^(?=.*[A-z])(?=.*[0-9])(?=.{1,})/)
        .required(),
      role: Joi.valid('MANAGER', 'OPERATOR'),
      isActive: Joi.boolean().required(),
      groupIds: Joi.array().items(Joi.string()),
      permissions: {
        createMachines: Joi.boolean().optional(),
        editMachines: Joi.boolean().optional(),
        deleteMachines: Joi.boolean().optional(),
        createProducts: Joi.boolean().optional(),
        editProducts: Joi.boolean().optional(),
        deleteProducts: Joi.boolean().optional(),
        transferProducts: Joi.boolean().optional(),
        createCategories: Joi.boolean().optional(),
        editCategories: Joi.boolean().optional(),
        deleteCategories: Joi.boolean().optional(),
        generateReports: Joi.boolean().optional(),
        addRemoteCredit: Joi.boolean().optional(),
        toggleMaintenanceMode: Joi.boolean().optional(),
        createGroups: Joi.boolean().optional(),
        editGroups: Joi.boolean().optional(),
        deleteGroups: Joi.boolean().optional(),
        createPointsOfSale: Joi.boolean().optional(),
        editPointsOfSale: Joi.boolean().optional(),
        deletePointsOfSale: Joi.boolean().optional(),
        createRoutes: Joi.boolean().optional(),
        editRoutes: Joi.boolean().optional(),
        deleteRoutes: Joi.boolean().optional(),
        createUsers: Joi.boolean().optional(),
        editUsers: Joi.boolean().optional(),
        deleteUsers: Joi.boolean().optional(),
        listUsers: Joi.boolean().optional(),
      },
    },
  }),
  CreateUserController.handle,
);
userRoutes.get('/', ListUsersController.handle);
userRoutes.put(
  '/',
  celebrate({
    body: {
      name: Joi.string().optional(),
      phone: Joi.string().min(10).max(11).optional(),
      password: Joi.string()
        .regex(/^(?=.*[A-z])(?=.*[0-9])(?=.{1,})/)
        .optional(),
      isActive: Joi.boolean().optional(),
      groupIds: Joi.array().items(Joi.string()).optional(),
      permissions: {
        createMachines: Joi.boolean().optional(),
        editMachines: Joi.boolean().optional(),
        deleteMachines: Joi.boolean().optional(),
        createProducts: Joi.boolean().optional(),
        editProducts: Joi.boolean().optional(),
        deleteProducts: Joi.boolean().optional(),
        transferProducts: Joi.boolean().optional(),
        createCategories: Joi.boolean().optional(),
        editCategories: Joi.boolean().optional(),
        deleteCategories: Joi.boolean().optional(),
        generateReports: Joi.boolean().optional(),
        addRemoteCredit: Joi.boolean().optional(),
        toggleMaintenanceMode: Joi.boolean().optional(),
        createGroups: Joi.boolean().optional(),
        editGroups: Joi.boolean().optional(),
        deleteGroups: Joi.boolean().optional(),
        createPointsOfSale: Joi.boolean().optional(),
        editPointsOfSale: Joi.boolean().optional(),
        deletePointsOfSale: Joi.boolean().optional(),
        createRoutes: Joi.boolean().optional(),
        editRoutes: Joi.boolean().optional(),
        deleteRoutes: Joi.boolean().optional(),
        createUsers: Joi.boolean().optional(),
        editUsers: Joi.boolean().optional(),
        deleteUsers: Joi.boolean().optional(),
        listUsers: Joi.boolean().optional(),
      },
    },
  }),
  EditUserController.handle,
);
userRoutes.get('/me', GetProfileController.handle);
userRoutes.put(
  '/me',
  multer({
    storage: multer.memoryStorage(),
  }).single('file'),
  celebrate({
    body: {
      name: Joi.string().optional(),
      phone: Joi.string().optional(),
      password: Joi.string()
        .regex(/^(?=.*[A-z])(?=.*[0-9])(?=.{1,})/)
        .optional(),
      oldPassword: Joi.string()
        .regex(/^(?=.*[A-z])(?=.*[0-9])(?=.{1,})/)
        .valid(Joi.ref('password')),
    },
  }),
  EditProfileController.handle,
);

export default userRoutes;
