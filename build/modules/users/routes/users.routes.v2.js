"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const express_1 = require("express");
const dashboard_info_controller_v2_1 = __importDefault(require("../services/dashboard-info/dashboard-info.controller.v2"));
const usersRoutesV2 = express_1.Router();
usersRoutesV2.use(auth_handler_1.default);
usersRoutesV2.get('/dashboard', dashboard_info_controller_v2_1.default.validate, dashboard_info_controller_v2_1.default.handle);
exports.default = usersRoutesV2;
