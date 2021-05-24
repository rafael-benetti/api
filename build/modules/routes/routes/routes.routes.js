"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const create_route_controller_1 = __importDefault(require("../services/create-route/create-route.controller"));
const delete_route_controller_1 = __importDefault(require("../services/delete-route/delete-route.controller"));
const detail_route_controller_1 = __importDefault(require("../services/detail-route/detail-route.controller"));
const edit_route_controller_1 = __importDefault(require("../services/edit-route/edit-route.controller"));
const list_routes_controller_1 = __importDefault(require("../services/list-routes/list-routes.controller"));
const routesRouter = express_1.Router();
routesRouter.use(auth_handler_1.default);
routesRouter.post('/', celebrate_1.celebrate({
    body: {
        label: celebrate_1.Joi.string().required(),
        pointsOfSaleIds: celebrate_1.Joi.array().items(celebrate_1.Joi.string()).min(1),
        operatorId: celebrate_1.Joi.string(),
    },
}), create_route_controller_1.default.handle);
routesRouter.get('/', list_routes_controller_1.default.handle);
routesRouter.put('/:routeId', celebrate_1.celebrate({
    body: {
        label: celebrate_1.Joi.string(),
        pointsOfSaleIds: celebrate_1.Joi.array().items(celebrate_1.Joi.string()).allow(null),
        operatorId: celebrate_1.Joi.string().allow(null),
    },
}), edit_route_controller_1.default.handle);
routesRouter.get('/:routeId', celebrate_1.celebrate({
    params: {
        routeId: celebrate_1.Joi.string(),
    },
    query: {
        period: celebrate_1.Joi.string().valid('DAILY', 'MONTHLY', 'WEEKLY'),
        startDate: celebrate_1.Joi.date(),
        endDate: celebrate_1.Joi.date(),
    },
}), detail_route_controller_1.default.handle);
routesRouter.delete('/:routeId', celebrate_1.celebrate({
    params: {
        routeId: celebrate_1.Joi.string(),
    },
}), delete_route_controller_1.default.handle);
exports.default = routesRouter;
