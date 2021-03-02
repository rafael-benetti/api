import authHandler from '@shared/server/express/middlewares/auth-handler';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import CreateGroupController from '../services/create-group/create-group-controller';
import EditGroupController from '../services/edit-group/edit-group.controller';
import ListGroupsController from '../services/list-groups/list-groups.controller';

const groupRoutes = Router();

groupRoutes.use(authHandler);

groupRoutes.post(
  '/',
  celebrate({
    body: {
      label: Joi.string().required(),
    },
  }),
  CreateGroupController.handle,
);

groupRoutes.get('/', ListGroupsController.handle);

groupRoutes.put(
  '/',
  celebrate({
    body: {
      label: Joi.string().required(),
    },
    query: {
      groupId: Joi.string().required(),
    },
  }),
  EditGroupController.handle,
);

export default groupRoutes;
