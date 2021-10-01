"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const add_to_stock_controller_ts_1 = __importDefault(require("../services/add-to-stock/add-to-stock.controller.ts"));
const create_product_controller_1 = __importDefault(require("../services/create-product/create-product.controller"));
const delete_product_controller_1 = __importDefault(require("../services/delete-product/delete-product.controller"));
const remove_from_machine_controller_1 = __importDefault(require("../services/remove-from-machine/remove-from-machine.controller"));
const transfer_product_controller_1 = __importDefault(require("../services/transfer-product/transfer-product.controller"));
const productsRoutes = express_1.Router();
productsRoutes.use(auth_handler_1.default);
productsRoutes.post('/', celebrate_1.celebrate({
    body: {
        groupId: celebrate_1.Joi.string().uuid().required(),
        label: celebrate_1.Joi.string().required(),
        type: celebrate_1.Joi.string().valid('PRIZE', 'SUPPLY').required(),
        quantity: celebrate_1.Joi.number().integer().default(0),
        cost: celebrate_1.Joi.number().default(0),
    },
}, { abortEarly: false }), create_product_controller_1.default.handle);
productsRoutes.post('/:productId/add-to-stock', celebrate_1.celebrate({
    body: {
        groupId: celebrate_1.Joi.string().uuid().required(),
        quantity: celebrate_1.Joi.number().integer().required(),
        type: celebrate_1.Joi.string().valid('PRIZE', 'SUPPLY').required(),
        cost: celebrate_1.Joi.number().required(),
    },
}, { abortEarly: false }), add_to_stock_controller_ts_1.default.handle);
productsRoutes.post('/:productId/transfer', celebrate_1.celebrate({
    body: {
        productType: celebrate_1.Joi.string().valid('PRIZE', 'SUPPLY').required(),
        productQuantity: celebrate_1.Joi.number().integer().required(),
        cost: celebrate_1.Joi.number(),
        from: {
            id: celebrate_1.Joi.string().uuid().required(),
            type: celebrate_1.Joi.string().valid('GROUP', 'USER').required(),
        },
        to: celebrate_1.Joi.object({
            id: celebrate_1.Joi.string().uuid().required(),
            type: celebrate_1.Joi.string().valid('GROUP', 'USER', 'MACHINE').required(),
            boxId: celebrate_1.Joi.when('type', {
                is: 'MACHINE',
                then: celebrate_1.Joi.string().required(),
                otherwise: celebrate_1.Joi.forbidden(),
            }),
        }).required(),
    },
}), transfer_product_controller_1.default.handle);
productsRoutes.patch('/:productId/remove-from-machine', remove_from_machine_controller_1.default.validate, remove_from_machine_controller_1.default.handle);
productsRoutes.delete('/:productId', celebrate_1.celebrate({
    body: {
        productType: celebrate_1.Joi.string().valid('PRIZE', 'SUPPLY').required(),
        from: {
            id: celebrate_1.Joi.string().uuid().required(),
            type: celebrate_1.Joi.string().valid('GROUP', 'USER').required(),
        },
    },
}), delete_product_controller_1.default.handle);
exports.default = productsRoutes;
