"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const create_point_of_sale_controller_1 = __importDefault(require("../services/create-point-of-sale/create-point-of-sale.controller"));
const edit_point_of_sale_controller_1 = __importDefault(require("../services/edit-point-of-sale/edit-point-of-sale.controller"));
const get_point_of_sale_details_controller_1 = __importDefault(require("../services/get-point-of-sale-details/get-point-of-sale-details.controller"));
const list_points_of_sale_controller_1 = __importDefault(require("../services/list-points-of-sale/list-points-of-sale.controller"));
const pointsOfSaleRoutes = express_1.Router();
pointsOfSaleRoutes.use(auth_handler_1.default);
pointsOfSaleRoutes.post('/', celebrate_1.celebrate({
    body: {
        groupId: celebrate_1.Joi.string().required(),
        label: celebrate_1.Joi.string().required(),
        contactName: celebrate_1.Joi.string().required(),
        primaryPhoneNumber: celebrate_1.Joi.string().required(),
        secondaryPhoneNumber: celebrate_1.Joi.string(),
        rent: celebrate_1.Joi.number().greater(-1),
        isPercentage: celebrate_1.Joi.bool(),
        address: celebrate_1.Joi.object({
            zipCode: celebrate_1.Joi.string().required(),
            state: celebrate_1.Joi.string().required(),
            city: celebrate_1.Joi.string().required(),
            street: celebrate_1.Joi.string().required(),
            neighborhood: celebrate_1.Joi.string().required(),
            number: celebrate_1.Joi.string().required(),
            extraInfo: celebrate_1.Joi.string(),
        }).required(),
    },
}, { abortEarly: false }), create_point_of_sale_controller_1.default.handle);
pointsOfSaleRoutes.patch('/:pointOfSaleId', celebrate_1.celebrate({
    body: {
        label: celebrate_1.Joi.string(),
        contactName: celebrate_1.Joi.string(),
        primaryPhoneNumber: celebrate_1.Joi.string(),
        secondaryPhoneNumber: celebrate_1.Joi.string(),
        rent: celebrate_1.Joi.number().greater(-1),
        isPercentage: celebrate_1.Joi.bool(),
        address: celebrate_1.Joi.object({
            extraInfo: celebrate_1.Joi.string(),
        }),
    },
}), edit_point_of_sale_controller_1.default.handle);
pointsOfSaleRoutes.get('/', list_points_of_sale_controller_1.default.handle);
pointsOfSaleRoutes.get('/:pointOfSaleId', celebrate_1.celebrate({
    query: {
        period: celebrate_1.Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY').default('DAILY'),
    },
    params: {
        pointOfSaleId: celebrate_1.Joi.string().required(),
    },
}), get_point_of_sale_details_controller_1.default.handle);
exports.default = pointsOfSaleRoutes;
