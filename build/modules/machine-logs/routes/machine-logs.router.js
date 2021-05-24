"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const express_1 = require("express");
const list_machine_logs_controller_1 = __importDefault(require("../services/list-machine-logs/list-machine-logs.controller"));
const machineLogsRouter = express_1.Router();
machineLogsRouter.use(auth_handler_1.default);
machineLogsRouter.get('/', list_machine_logs_controller_1.default.validate, list_machine_logs_controller_1.default.handle);
exports.default = machineLogsRouter;
