"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const create_counter_type_controller_1 = __importDefault(require("../services/create-counter-type/create-counter-type.controller"));
const edit_counter_type_controller_1 = __importDefault(require("../services/edit-counter-type/edit-counter-type.controller"));
const list_counter_types_controller_1 = __importDefault(require("../services/list-counter-types/list-counter-types.controller"));
const counterTypesRouter = express_1.Router();
counterTypesRouter.use(auth_handler_1.default);
counterTypesRouter.post('/', celebrate_1.celebrate({
    body: {
        label: celebrate_1.Joi.string().required(),
        type: celebrate_1.Joi.string().valid('IN', 'OUT').required(),
    },
}), create_counter_type_controller_1.default.handle);
counterTypesRouter.get('/', list_counter_types_controller_1.default.handle);
counterTypesRouter.patch('/:counterTypeId', celebrate_1.celebrate({
    body: {
        label: celebrate_1.Joi.string().required(),
    },
    params: {
        counterTypeId: celebrate_1.Joi.string().required(),
    },
}), edit_counter_type_controller_1.default.handle);
exports.default = counterTypesRouter;
