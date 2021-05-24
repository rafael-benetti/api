"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const list_telemetry_logs_controller_1 = __importDefault(require("../services/list-telemetry-logs/list-telemetry-logs.controller"));
const telemetryLogsRouter = express_1.Router();
telemetryLogsRouter.use(auth_handler_1.default);
telemetryLogsRouter.get('/', celebrate_1.celebrate({
    query: {
        machineId: celebrate_1.Joi.string().required(),
        startDate: celebrate_1.Joi.date(),
        endDate: celebrate_1.Joi.date(),
        type: celebrate_1.Joi.string().valid('IN', 'OUT'),
        limit: celebrate_1.Joi.number(),
        offset: celebrate_1.Joi.number(),
    },
}), list_telemetry_logs_controller_1.default.handle);
exports.default = telemetryLogsRouter;
