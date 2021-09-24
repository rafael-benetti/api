"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const create_category_controller_1 = __importDefault(require("../services/create-category/create-category.controller"));
const edit_category_controller_1 = __importDefault(require("../services/edit-category/edit-category.controller"));
const list_categories_controller_1 = __importDefault(require("../services/list-categories/list-categories.controller"));
const categoriesRouter = express_1.Router();
categoriesRouter.use(auth_handler_1.default);
categoriesRouter.post('/', celebrate_1.celebrate({
    body: {
        label: celebrate_1.Joi.string().required(),
        boxes: celebrate_1.Joi.array().items({
            id: celebrate_1.Joi.string(),
            counters: celebrate_1.Joi.array().items({
                counterTypeId: celebrate_1.Joi.string().required(),
                hasMechanical: celebrate_1.Joi.boolean().required(),
                hasDigital: celebrate_1.Joi.boolean().required(),
                pin: celebrate_1.Joi.string().required(),
            }),
        }),
    },
}), create_category_controller_1.default.handle);
categoriesRouter.get('/', list_categories_controller_1.default.handle);
categoriesRouter.put('/:categoryId', celebrate_1.celebrate({
    body: {
        label: celebrate_1.Joi.string(),
        boxes: celebrate_1.Joi.array().items({
            id: celebrate_1.Joi.string(),
            counters: celebrate_1.Joi.array().items({
                id: celebrate_1.Joi.string(),
                counterTypeId: celebrate_1.Joi.string().required(),
                hasMechanical: celebrate_1.Joi.boolean().required(),
                hasDigital: celebrate_1.Joi.boolean().required(),
                pin: celebrate_1.Joi.string().required(),
            }),
        }),
    },
    params: {
        categoryId: celebrate_1.Joi.string().required(),
    },
}), edit_category_controller_1.default.handle);
exports.default = categoriesRouter;
