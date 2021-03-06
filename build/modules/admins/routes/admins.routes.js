"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_error_1 = __importDefault(require("../../../shared/errors/app-error"));
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const authenticate_admin_controller_1 = __importDefault(require("../services/authenticate-admin/authenticate-admin.controller"));
const create_admin_controller_1 = __importDefault(require("../services/create-admin/create-admin.controller"));
const create_owner_controller_1 = __importDefault(require("../services/create-owner/create-owner.controller"));
const create_telemetry_board_controller_1 = __importDefault(require("../services/create-telemetry-board/create-telemetry-board.controller"));
const delete_logs_controller_1 = __importDefault(require("../services/delete-logs/delete-logs.controller"));
const edit_owner_controller_1 = __importDefault(require("../services/edit-owner/edit-owner.controller"));
const get_all_telemetry_boards_controller_1 = __importDefault(require("../services/get-all-telemetry-boards/get-all-telemetry-boards.controller"));
const get_user_token_controller_1 = __importDefault(require("../services/get-user-token/get-user-token.controller"));
const list_logs_controller_1 = __importDefault(require("../services/list-logs/list-logs.controller"));
const list_owners_controller_1 = __importDefault(require("../services/list-owners/list-owners.controller"));
const adminsRoutes = express_1.Router();
adminsRoutes.post('/', (req, _, next) => {
    if (req.headers.authorization !== 'charanko')
        throw app_error_1.default.authorizationError;
    return next();
}, celebrate_1.celebrate({
    body: {
        email: celebrate_1.Joi.string().email().required(),
        name: celebrate_1.Joi.string().required(),
    },
}, { abortEarly: false }), create_admin_controller_1.default.handle);
adminsRoutes.post('/auth', celebrate_1.celebrate({
    body: {
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().required(),
    },
}, { abortEarly: false }), authenticate_admin_controller_1.default.handle);
adminsRoutes.use(auth_handler_1.default);
adminsRoutes.post('/owners', create_owner_controller_1.default.handle);
adminsRoutes.get('/owners', list_owners_controller_1.default.handle);
adminsRoutes.post('/telemetry-boards', create_telemetry_board_controller_1.default.validate, create_telemetry_board_controller_1.default.handle);
adminsRoutes.patch('/owners/:ownerId', edit_owner_controller_1.default.handle);
adminsRoutes.get('/telemetry-boards', get_all_telemetry_boards_controller_1.default.handle);
adminsRoutes.post('/owners/auth/:userId', get_user_token_controller_1.default.handle);
adminsRoutes.get('/logs', list_logs_controller_1.default.handle);
adminsRoutes.delete('/logs', delete_logs_controller_1.default.handle);
exports.default = adminsRoutes;
