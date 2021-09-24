"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orm_provider_1 = __importDefault(require("../../../providers/orm-provider/contracts/models/orm-provider"));
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const tsyringe_1 = require("tsyringe");
const create_collection_controller_1 = __importDefault(require("../services/create-collection/create-collection.controller"));
const edit_collection_controller_1 = __importDefault(require("../services/edit-collection/edit-collection.controller"));
const get_collection_controller_1 = __importDefault(require("../services/get-collection/get-collection.controller"));
const get_collections_controller_1 = __importDefault(require("../services/get-collections/get-collections.controller"));
const review_collection_controller_1 = __importDefault(require("../services/review-collection/review-collection.controller"));
const collectionsRoutes = express_1.Router();
collectionsRoutes.use(auth_handler_1.default);
collectionsRoutes.post('/', multer_1.default({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024,
    },
}).any(), tsyringe_1.container.resolve('OrmProvider').forkMiddleware, (req, res, next) => {
    if (typeof req.body.boxCollections === 'string')
        req.body.boxCollections = JSON.parse(req.body.boxCollections);
    if (typeof req.body.startLocation === 'string')
        req.body.startLocation = JSON.parse(req.body.startLocation);
    if (typeof req.body.endLocation === 'string')
        req.body.endLocation = JSON.parse(req.body.endLocation);
    return next();
}, create_collection_controller_1.default.validate, create_collection_controller_1.default.handle);
collectionsRoutes.put('/:collectionId', multer_1.default({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024,
    },
}).any(), tsyringe_1.container.resolve('OrmProvider').forkMiddleware, (req, res, next) => {
    if (typeof req.body.boxCollections === 'string')
        req.body.boxCollections = JSON.parse(req.body.boxCollections);
    if (typeof req.body.photosToDelete === 'string')
        req.body.photosToDelete = JSON.parse(req.body.photosToDelete);
    return next();
}, tsyringe_1.container.resolve('OrmProvider').forkMiddleware, edit_collection_controller_1.default.validate, edit_collection_controller_1.default.handle);
collectionsRoutes.put('/review/:collectionId', review_collection_controller_1.default.validate, review_collection_controller_1.default.handle);
collectionsRoutes.get('/', get_collections_controller_1.default.validate, get_collections_controller_1.default.handle);
collectionsRoutes.get('/:collectionId', get_collection_controller_1.default.validate, get_collection_controller_1.default.handle);
exports.default = collectionsRoutes;
