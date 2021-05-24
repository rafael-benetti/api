import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateGroupController from '../services/create-group/create-group.controller';
import DetailGroupController from '../services/detail-group/detail-group.controller';
import EditGroupController from '../services/edit-group/edit-group.controller';
import ListGroupsController from '../services/list-groups/list-groups.controller';

const groupsRoutes = Router();

groupsRoutes.use(authHandler);

groupsRoutes.post(
  '/',
  celebrate(
    {
      body: {
        label: Joi.string().required(),
      },
    },
    { abortEarly: false },
  ),
  CreateGroupController.handle,
);

groupsRoutes.patch(
  '/:groupId',
  celebrate(
    {
      body: {
        label: Joi.string(),
      },
    },
    { abortEarly: false },
  ),
  EditGroupController.handle,
);

groupsRoutes.get(
  '/',
  celebrate(
    {
      query: {
        limit: Joi.number().positive().integer(),
        offset: Joi.number().min(0).integer(),
      },
    },
    { abortEarly: false },
  ),
  ListGroupsController.handle,
);

groupsRoutes.get(
  '/:groupId',
  DetailGroupController.validate,
  DetailGroupController.handle,
);

export default groupsRoutes;
