"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const express_1 = require("express");
const detail_group_controller_v2_1 = __importDefault(require("../services/detail-group/detail-group.controller.v2"));
const groupsRoutes = express_1.Router();
groupsRoutes.use(auth_handler_1.default);
groupsRoutes.get('/:groupId', detail_group_controller_v2_1.default.validate, detail_group_controller_v2_1.default.handle);
exports.default = groupsRoutes;
