import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import authHandler from '@shared/server/express/middlewares/auth-handler';
import { Router } from 'express';
import multer from 'multer';
import { container } from 'tsyringe';
import CreateCollectionController from '../services/create-collection/create-collection.controller';
import EditCollectionController from '../services/edit-collection/edit-collection.controller';
import GetCollectionController from '../services/get-collection/get-collection.controller';
import GetCollectionsController from '../services/get-collections/get-collections.controller';
import ReviewCollectionController from '../services/review-collection/review-collection.controller';

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
  container.resolve<OrmProvider>('OrmProvider').forkMiddleware,
  (req, res, next) => {
    if (typeof req.body.boxCollections === 'string')
      req.body.boxCollections = JSON.parse(req.body.boxCollections);

    if (typeof req.body.startLocation === 'string')
      req.body.startLocation = JSON.parse(req.body.startLocation);

    if (typeof req.body.endLocation === 'string')
      req.body.endLocation = JSON.parse(req.body.endLocation);

    return next();
  },
  CreateCollectionController.validate,
  CreateCollectionController.handle,
);

collectionsRoutes.put(
  '/:collectionId',
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 1024 * 1024,
    },
  }).any(),
  container.resolve<OrmProvider>('OrmProvider').forkMiddleware,
  (req, res, next) => {
    if (typeof req.body.boxCollections === 'string')
      req.body.boxCollections = JSON.parse(req.body.boxCollections);
    if (typeof req.body.photosToDelete === 'string')
      req.body.photosToDelete = JSON.parse(req.body.photosToDelete);

    return next();
  },
  container.resolve<OrmProvider>('OrmProvider').forkMiddleware,
  EditCollectionController.validate,
  EditCollectionController.handle,
);

collectionsRoutes.put(
  '/review/:collectionId',
  ReviewCollectionController.validate,
  ReviewCollectionController.handle,
);

collectionsRoutes.get(
  '/',
  GetCollectionsController.validate,
  GetCollectionsController.handle,
);

collectionsRoutes.get(
  '/:collectionId',
  GetCollectionController.validate,
  GetCollectionController.handle,
);

export default collectionsRoutes;
