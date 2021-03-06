"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const create_notification_controller_1 = __importDefault(require("../services/craete-notification/create-notification.controller"));
const get_numbers_of_unread_notifications_controller_1 = __importDefault(require("../services/get-notifications-count/get-numbers-of-unread-notifications.controller"));
const list_notifications_controller_1 = __importDefault(require("../services/list-notifications/list-notifications.controller"));
// TODO: ADICIONAR FUNÇÃO DE AUTENTICAÇÃO
const notificationsRouter = express_1.Router();
notificationsRouter.post('/', celebrate_1.celebrate({
    body: {
        operatorId: celebrate_1.Joi.string(),
        machineId: celebrate_1.Joi.string(),
        groupId: celebrate_1.Joi.string().required(),
        title: celebrate_1.Joi.string().required(),
        body: celebrate_1.Joi.string().required(),
    },
}), create_notification_controller_1.default.handle);
notificationsRouter.use(auth_handler_1.default);
notificationsRouter.get('/', list_notifications_controller_1.default.handle);
notificationsRouter.get('/count', get_numbers_of_unread_notifications_controller_1.default.handle);
exports.default = notificationsRouter;
