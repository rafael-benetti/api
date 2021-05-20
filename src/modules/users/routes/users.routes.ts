import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';
import { container } from 'tsyringe';
import AuthenticateUserController from '../services/authenticate-user/authenticate-user.controller';
import CreateManagerController from '../services/create-manager/create-manager.controller';
import CreateOperatorController from '../services/create-operator/create-operator.controller';
import DashboardInfoController from '../services/dashboard-info/dashboard-info.controller';
import EditManagerController from '../services/edit-manager/edit-manager.controller';
import EditOperatorController from '../services/edit-operator/edit-operator.controller';
import GetUserProfileController from '../services/get-user-profile/get-user-profile.controller';
import ListManagersController from '../services/list-managers/list-managers.controller';
import ListOperatorsController from '../services/list-operators/list-operators.controller';
import UpdateUserProfileController from '../services/update-user-profile/update-user-profile.controller';

const usersRoutes = Router();

usersRoutes.post(
  '/auth',
  celebrate(
    {
      body: {
        email: Joi.string().required(),
        password: Joi.string().required(),
      },
    },
    { abortEarly: false },
  ),
  AuthenticateUserController.handle,
);

usersRoutes.use(authHandler);

usersRoutes.get('/me', GetUserProfileController.handle);

usersRoutes.patch(
  '/me',
  multer({
    storage: multer.memoryStorage(),
  }).single('file'),
  container.resolve<OrmProvider>('OrmProvider').forkMiddleware,
  celebrate({
    body: {
      name: Joi.string(),
      newPassword: Joi.string(),
      password: Joi.string().when(Joi.ref('newPassword'), {
        then: Joi.string().required(),
      }),
      phoneNumber: Joi.string().min(13).max(14),
    },
  }),
  UpdateUserProfileController.handle,
);

usersRoutes.post(
  '/managers',
  celebrate(
    {
      body: {
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        groupIds: Joi.array().items(Joi.string()).min(1).required(),
        permissions: Joi.object({
          createMachines: Joi.bool().default(false),
          editMachines: Joi.bool().default(false),
          deleteMachines: Joi.bool().default(false),
          fixMachineStock: Joi.bool().default(false),
          createProducts: Joi.bool().default(false),
          editProducts: Joi.bool().default(false),
          deleteProducts: Joi.bool().default(false),
          createCategories: Joi.bool().default(false),
          editCategories: Joi.bool().default(false),
          deleteCategories: Joi.bool().default(false),
          generateReports: Joi.bool().default(false),
          addRemoteCredit: Joi.bool().default(false),
          toggleMaintenanceMode: Joi.bool().default(false),
          createGroups: Joi.bool().default(false),
          editGroups: Joi.bool().default(false),
          deleteGroups: Joi.bool().default(false),
          createPointsOfSale: Joi.bool().default(false),
          editPointsOfSale: Joi.bool().default(false),
          deletePointsOfSale: Joi.bool().default(false),
          createRoutes: Joi.bool().default(false),
          editRoutes: Joi.bool().default(false),
          deleteRoutes: Joi.bool().default(false),
          createManagers: Joi.bool().default(false),
          createOperators: Joi.bool().default(false),
          listManagers: Joi.bool().default(false),
          listOperators: Joi.bool().default(false),
        }).required(),
        phoneNumber: Joi.string().min(13).max(14),
      },
    },
    { abortEarly: false },
  ),
  CreateManagerController.handle,
);

usersRoutes.patch(
  '/managers/:managerId',
  celebrate(
    {
      body: {
        groupIds: Joi.array().items(Joi.string()).min(1),
        permissions: Joi.object({
          createMachines: Joi.bool().default(false),
          editMachines: Joi.bool().default(false),
          deleteMachines: Joi.bool().default(false),
          fixMachineStock: Joi.bool().default(false),
          createProducts: Joi.bool().default(false),
          editProducts: Joi.bool().default(false),
          deleteProducts: Joi.bool().default(false),
          createCategories: Joi.bool().default(false),
          editCategories: Joi.bool().default(false),
          deleteCategories: Joi.bool().default(false),
          generateReports: Joi.bool().default(false),
          addRemoteCredit: Joi.bool().default(false),
          toggleMaintenanceMode: Joi.bool().default(false),
          createGroups: Joi.bool().default(false),
          editGroups: Joi.bool().default(false),
          deleteGroups: Joi.bool().default(false),
          createPointsOfSale: Joi.bool().default(false),
          editPointsOfSale: Joi.bool().default(false),
          deletePointsOfSale: Joi.bool().default(false),
          createRoutes: Joi.bool().default(false),
          editRoutes: Joi.bool().default(false),
          deleteRoutes: Joi.bool().default(false),
          createManagers: Joi.bool().default(false),
          createOperators: Joi.bool().default(false),
          listManagers: Joi.bool().default(false),
          listOperators: Joi.bool().default(false),
        }),
        phoneNumber: Joi.string().min(13).max(14),
        isActive: Joi.bool(),
      },
    },
    { abortEarly: false },
  ),
  EditManagerController.handle,
);

usersRoutes.get(
  '/managers',
  celebrate({
    query: {
      groupId: Joi.string(),
      limit: Joi.number().positive().integer(),
      offset: Joi.number().min(0).integer(),
    },
  }),
  ListManagersController.handle,
);

usersRoutes.post(
  '/operators',
  celebrate(
    {
      body: {
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        groupIds: Joi.array().items(Joi.string()).min(1).required(),
        permissions: Joi.object({
          editMachines: Joi.bool().default(false),
          deleteMachines: Joi.bool().default(false),
          fixMachineStock: Joi.bool().default(false),
          addRemoteCredit: Joi.bool().default(false),
          toggleMaintenanceMode: Joi.bool().default(false),
          editCollections: Joi.bool().default(false),
          deleteCollections: Joi.bool().default(false),
        }).required(),
        phoneNumber: Joi.string().min(13).max(14),
      },
    },
    { abortEarly: false },
  ),
  CreateOperatorController.handle,
);

usersRoutes.patch(
  '/operators/:operatorId',
  celebrate(
    {
      body: {
        groupIds: Joi.array().items(Joi.string()).min(1),
        permissions: Joi.object({
          editMachines: Joi.bool().default(false),
          deleteMachines: Joi.bool().default(false),
          fixMachineStock: Joi.bool().default(false),
          addRemoteCredit: Joi.bool().default(false),
          toggleMaintenanceMode: Joi.bool().default(false),
          editCollections: Joi.bool().default(false),
          deleteCollections: Joi.bool().default(false),
        }),
        phoneNumber: Joi.string().min(13).max(14),
        isActive: Joi.bool(),
      },
    },
    { abortEarly: false },
  ),
  EditOperatorController.handle,
);

usersRoutes.get(
  '/operators',
  celebrate({
    query: {
      groupId: Joi.string(),
      limit: Joi.number().positive().integer(),
      offset: Joi.number().min(0).integer(),
    },
  }),
  ListOperatorsController.handle,
);

usersRoutes.get('/dashboard', DashboardInfoController.handle);

export default usersRoutes;
