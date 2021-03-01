import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateUserController from '../services/create-user/create-user-controller';
import EditUserController from '../services/edit-user/edit-user-controller';
import ListUsersController from '../services/list-users/list-users-controller';

const userRoutes = Router();

const createUserController = new CreateUserController();
const listUsersController = new ListUsersController();
const updateUserController = new EditUserController();

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
        listGroups: Joi.boolean().optional(),
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
  createUserController.handle,
);
userRoutes.get('/', listUsersController.handle);
userRoutes.patch('/', updateUserController.handle);

export default userRoutes;
