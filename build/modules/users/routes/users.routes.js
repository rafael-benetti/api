"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orm_provider_1 = __importDefault(require("../../../providers/orm-provider/contracts/models/orm-provider"));
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const tsyringe_1 = require("tsyringe");
const authenticate_user_controller_1 = __importDefault(require("../services/authenticate-user/authenticate-user.controller"));
const create_manager_controller_1 = __importDefault(require("../services/create-manager/create-manager.controller"));
const create_operator_controller_1 = __importDefault(require("../services/create-operator/create-operator.controller"));
const dashboard_info_controller_1 = __importDefault(require("../services/dashboard-info/dashboard-info.controller"));
const edit_manager_controller_1 = __importDefault(require("../services/edit-manager/edit-manager.controller"));
const edit_operator_controller_1 = __importDefault(require("../services/edit-operator/edit-operator.controller"));
const get_user_profile_controller_1 = __importDefault(require("../services/get-user-profile/get-user-profile.controller"));
const list_managers_controller_1 = __importDefault(require("../services/list-managers/list-managers.controller"));
const list_operators_controller_1 = __importDefault(require("../services/list-operators/list-operators.controller"));
const request_password_reset_controller_1 = __importDefault(require("../services/request-password-reset/request-password-reset.controller"));
const reset_password_controller_1 = __importDefault(require("../services/reset-password/reset-password.controller"));
const update_user_profile_controller_1 = __importDefault(require("../services/update-user-profile/update-user-profile.controller"));
const usersRoutes = express_1.Router();
usersRoutes.post('/auth', celebrate_1.celebrate({
    body: {
        email: celebrate_1.Joi.string().required(),
        password: celebrate_1.Joi.string().required(),
    },
}, { abortEarly: false }), authenticate_user_controller_1.default.handle);
usersRoutes.post('/forgot-password', celebrate_1.celebrate({
    body: {
        email: celebrate_1.Joi.string().email().required(),
    },
}), request_password_reset_controller_1.default.handle);
usersRoutes.post('/reset-password', celebrate_1.celebrate({
    body: {
        resetPasswordToken: celebrate_1.Joi.string().required(),
    },
}), reset_password_controller_1.default.handle);
usersRoutes.use(auth_handler_1.default);
usersRoutes.get('/me', get_user_profile_controller_1.default.handle);
usersRoutes.patch('/me', multer_1.default({
    storage: multer_1.default.memoryStorage(),
}).single('file'), tsyringe_1.container.resolve('OrmProvider').forkMiddleware, celebrate_1.celebrate({
    body: {
        name: celebrate_1.Joi.string(),
        deviceToken: celebrate_1.Joi.string(),
        newPassword: celebrate_1.Joi.string(),
        password: celebrate_1.Joi.string().when(celebrate_1.Joi.ref('newPassword'), {
            then: celebrate_1.Joi.string().required(),
        }),
        phoneNumber: celebrate_1.Joi.string().min(13).max(14),
    },
}), update_user_profile_controller_1.default.handle);
usersRoutes.post('/managers', celebrate_1.celebrate({
    body: {
        email: celebrate_1.Joi.string().email().required(),
        name: celebrate_1.Joi.string().required(),
        groupIds: celebrate_1.Joi.array().items(celebrate_1.Joi.string()).min(1).required(),
        permissions: celebrate_1.Joi.object({
            createMachines: celebrate_1.Joi.bool().default(false),
            editMachines: celebrate_1.Joi.bool().default(false),
            deleteMachines: celebrate_1.Joi.bool().default(false),
            fixMachineStock: celebrate_1.Joi.bool().default(false),
            createProducts: celebrate_1.Joi.bool().default(false),
            editProducts: celebrate_1.Joi.bool().default(false),
            deleteProducts: celebrate_1.Joi.bool().default(false),
            createCategories: celebrate_1.Joi.bool().default(false),
            editCategories: celebrate_1.Joi.bool().default(false),
            deleteCategories: celebrate_1.Joi.bool().default(false),
            generateReports: celebrate_1.Joi.bool().default(false),
            addRemoteCredit: celebrate_1.Joi.bool().default(false),
            toggleMaintenanceMode: celebrate_1.Joi.bool().default(false),
            createGroups: celebrate_1.Joi.bool().default(false),
            editGroups: celebrate_1.Joi.bool().default(false),
            deleteGroups: celebrate_1.Joi.bool().default(false),
            createPointsOfSale: celebrate_1.Joi.bool().default(false),
            editPointsOfSale: celebrate_1.Joi.bool().default(false),
            deletePointsOfSale: celebrate_1.Joi.bool().default(false),
            createRoutes: celebrate_1.Joi.bool().default(false),
            editRoutes: celebrate_1.Joi.bool().default(false),
            deleteRoutes: celebrate_1.Joi.bool().default(false),
            createManagers: celebrate_1.Joi.bool().default(false),
            createOperators: celebrate_1.Joi.bool().default(false),
            listManagers: celebrate_1.Joi.bool().default(false),
            listOperators: celebrate_1.Joi.bool().default(false),
        }).required(),
        phoneNumber: celebrate_1.Joi.string().min(13).max(14),
    },
}, { abortEarly: false }), create_manager_controller_1.default.handle);
usersRoutes.patch('/managers/:managerId', celebrate_1.celebrate({
    body: {
        groupIds: celebrate_1.Joi.array().items(celebrate_1.Joi.string()).min(1),
        permissions: celebrate_1.Joi.object({
            createMachines: celebrate_1.Joi.bool().default(false),
            editMachines: celebrate_1.Joi.bool().default(false),
            deleteMachines: celebrate_1.Joi.bool().default(false),
            fixMachineStock: celebrate_1.Joi.bool().default(false),
            createProducts: celebrate_1.Joi.bool().default(false),
            editProducts: celebrate_1.Joi.bool().default(false),
            deleteProducts: celebrate_1.Joi.bool().default(false),
            createCategories: celebrate_1.Joi.bool().default(false),
            editCategories: celebrate_1.Joi.bool().default(false),
            deleteCategories: celebrate_1.Joi.bool().default(false),
            generateReports: celebrate_1.Joi.bool().default(false),
            addRemoteCredit: celebrate_1.Joi.bool().default(false),
            toggleMaintenanceMode: celebrate_1.Joi.bool().default(false),
            createGroups: celebrate_1.Joi.bool().default(false),
            editGroups: celebrate_1.Joi.bool().default(false),
            deleteGroups: celebrate_1.Joi.bool().default(false),
            createPointsOfSale: celebrate_1.Joi.bool().default(false),
            editPointsOfSale: celebrate_1.Joi.bool().default(false),
            deletePointsOfSale: celebrate_1.Joi.bool().default(false),
            createRoutes: celebrate_1.Joi.bool().default(false),
            editRoutes: celebrate_1.Joi.bool().default(false),
            deleteRoutes: celebrate_1.Joi.bool().default(false),
            createManagers: celebrate_1.Joi.bool().default(false),
            createOperators: celebrate_1.Joi.bool().default(false),
            listManagers: celebrate_1.Joi.bool().default(false),
            listOperators: celebrate_1.Joi.bool().default(false),
        }),
        phoneNumber: celebrate_1.Joi.string().min(13).max(14),
        isActive: celebrate_1.Joi.bool(),
    },
}, { abortEarly: false }), edit_manager_controller_1.default.handle);
usersRoutes.get('/managers', celebrate_1.celebrate({
    query: {
        groupId: celebrate_1.Joi.string(),
        limit: celebrate_1.Joi.number().positive().integer(),
        offset: celebrate_1.Joi.number().min(0).integer(),
    },
}), list_managers_controller_1.default.handle);
usersRoutes.post('/operators', celebrate_1.celebrate({
    body: {
        email: celebrate_1.Joi.string().email().required(),
        name: celebrate_1.Joi.string().required(),
        groupIds: celebrate_1.Joi.array().items(celebrate_1.Joi.string()).min(1).required(),
        permissions: celebrate_1.Joi.object({
            editMachines: celebrate_1.Joi.bool().default(false),
            deleteMachines: celebrate_1.Joi.bool().default(false),
            fixMachineStock: celebrate_1.Joi.bool().default(false),
            addRemoteCredit: celebrate_1.Joi.bool().default(false),
            toggleMaintenanceMode: celebrate_1.Joi.bool().default(false),
            editCollections: celebrate_1.Joi.bool().default(false),
            deleteCollections: celebrate_1.Joi.bool().default(false),
        }).required(),
        phoneNumber: celebrate_1.Joi.string().min(13).max(14),
    },
}, { abortEarly: false }), create_operator_controller_1.default.handle);
usersRoutes.patch('/operators/:operatorId', celebrate_1.celebrate({
    body: {
        groupIds: celebrate_1.Joi.array().items(celebrate_1.Joi.string()).min(1),
        permissions: celebrate_1.Joi.object({
            editMachines: celebrate_1.Joi.bool().default(false),
            deleteMachines: celebrate_1.Joi.bool().default(false),
            fixMachineStock: celebrate_1.Joi.bool().default(false),
            addRemoteCredit: celebrate_1.Joi.bool().default(false),
            toggleMaintenanceMode: celebrate_1.Joi.bool().default(false),
            editCollections: celebrate_1.Joi.bool().default(false),
            deleteCollections: celebrate_1.Joi.bool().default(false),
        }),
        phoneNumber: celebrate_1.Joi.string().min(13).max(14),
        isActive: celebrate_1.Joi.bool(),
    },
}, { abortEarly: false }), edit_operator_controller_1.default.handle);
usersRoutes.get('/operators', celebrate_1.celebrate({
    query: {
        groupId: celebrate_1.Joi.string(),
        limit: celebrate_1.Joi.number().positive().integer(),
        offset: celebrate_1.Joi.number().min(0).integer(),
    },
}), list_operators_controller_1.default.handle);
usersRoutes.get('/dashboard', dashboard_info_controller_1.default.validate, dashboard_info_controller_1.default.handle);
exports.default = usersRoutes;
