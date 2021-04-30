import authHandler from '@shared/server/express/middlewares/auth-handler';
import { Router } from 'express';
import multer from 'multer';
import CreateCollectionController from '../services/create-collection/create-collection.controller';
import EditCollectionController from '../services/edit-collection/edit-collection.controller';
import GetCollectionsController from '../services/get-collections/get-collections.controller';

const collectionsRoutes = Router();

collectionsRoutes.use(authHandler);

collectionsRoutes.post(
  '/',
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 1024 * 1024,
    },
  }).any(),
  (req, res, next) => {
    if (typeof req.body.boxCollections === 'string')
      req.body.boxCollections = JSON.parse(req.body.boxCollections);

    return next();
  },
  CreateCollectionController.validate,
  CreateCollectionController.handle,
);

collectionsRoutes.put(
  '/',
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 1024 * 1024,
    },
  }).any(),
  (req, res, next) => {
    if (typeof req.body.boxCollections === 'string')
      req.body.boxCollections = JSON.parse(req.body.boxCollections);

    return next();
  },
  EditCollectionController.validate,
  EditCollectionController.handle,
);

collectionsRoutes.get(
  '/',
  GetCollectionsController.validate,
  GetCollectionsController.handle,
);

export default collectionsRoutes;
