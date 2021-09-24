"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const list_routes_controller_v2_1 = __importDefault(require("../services/list-routes/list-routes.controller.v2"));
const routesRouterV2 = express_1.Router();
routesRouterV2.use(auth_handler_1.default);
routesRouterV2.get('/', celebrate_1.celebrate({
    query: {
        limit: celebrate_1.Joi.number(),
        offset: celebrate_1.Joi.number(),
        groupId: celebrate_1.Joi.string().uuid(),
        operatorId: celebrate_1.Joi.string().uuid(),
        pointOfSaleId: celebrate_1.Joi.string().uuid(),
        label: celebrate_1.Joi.string(),
    },
}), list_routes_controller_v2_1.default.handle);
exports.default = routesRouterV2;
