"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const create_group_controller_1 = __importDefault(require("../services/create-group/create-group.controller"));
const detail_group_controller_1 = __importDefault(require("../services/detail-group/detail-group.controller"));
const edit_group_controller_1 = __importDefault(require("../services/edit-group/edit-group.controller"));
const list_groups_controller_1 = __importDefault(require("../services/list-groups/list-groups.controller"));
const groupsRoutes = express_1.Router();
groupsRoutes.use(auth_handler_1.default);
groupsRoutes.post('/', celebrate_1.celebrate({
    body: {
        label: celebrate_1.Joi.string().required(),
    },
}, { abortEarly: false }), create_group_controller_1.default.handle);
groupsRoutes.patch('/:groupId', celebrate_1.celebrate({
    body: {
        label: celebrate_1.Joi.string(),
    },
}, { abortEarly: false }), edit_group_controller_1.default.handle);
groupsRoutes.get('/', celebrate_1.celebrate({
    query: {
        limit: celebrate_1.Joi.number().positive().integer(),
        offset: celebrate_1.Joi.number().min(0).integer(),
    },
}, { abortEarly: false }), list_groups_controller_1.default.handle);
groupsRoutes.get('/:groupId', detail_group_controller_1.default.validate, detail_group_controller_1.default.handle);
exports.default = groupsRoutes;
