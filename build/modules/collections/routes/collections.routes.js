"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const create_collection_controller_1 = __importDefault(require("../services/create-collection/create-collection.controller"));
const edit_collection_controller_1 = __importDefault(require("../services/edit-collection/edit-collection.controller"));
const get_collections_controller_1 = __importDefault(require("../services/get-collections/get-collections.controller"));
const collectionsRoutes = express_1.Router();
collectionsRoutes.use(auth_handler_1.default);
collectionsRoutes.post('/', multer_1.default({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024,
    },
}).any(), (req, res, next) => {
    if (typeof req.body.boxCollections === 'string')
        req.body.boxCollections = JSON.parse(req.body.boxCollections);
    return next();
}, create_collection_controller_1.default.validate, create_collection_controller_1.default.handle);
collectionsRoutes.put('/', multer_1.default({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024,
    },
}).any(), (req, res, next) => {
    if (typeof req.body.boxCollections === 'string')
        req.body.boxCollections = JSON.parse(req.body.boxCollections);
    return next();
}, edit_collection_controller_1.default.validate, edit_collection_controller_1.default.handle);
collectionsRoutes.get('/', get_collections_controller_1.default.validate, get_collections_controller_1.default.handle);
exports.default = collectionsRoutes;
