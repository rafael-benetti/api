"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const celebrate_1 = require("celebrate");
const express_1 = require("express");
const create_machine_controller_1 = __importDefault(require("../services/create-machine/create-machine.controller"));
const edit_machine_controller_1 = __importDefault(require("../services/edit-machine/edit-machine.controller"));
const fix_machine_stock_controller_1 = __importDefault(require("../services/fix-machine-stock/fix-machine-stock.controller"));
const get_machine_details_controller_1 = __importDefault(require("../services/get-machine-details/get-machine-details.controller"));
const list_machines_controller_1 = __importDefault(require("../services/list-machines/list-machines.controller"));
const machinesRouter = express_1.Router();
machinesRouter.use(auth_handler_1.default);
machinesRouter.post('/', celebrate_1.celebrate({
    body: {
        serialNumber: celebrate_1.Joi.string().required(),
        categoryId: celebrate_1.Joi.string().required(),
        typeOfPrizeId: celebrate_1.Joi.string().allow(null),
        minimumPrizeCount: celebrate_1.Joi.number().allow(null),
        groupId: celebrate_1.Joi.string().required(),
        gameValue: celebrate_1.Joi.number().positive().required(),
        locationId: celebrate_1.Joi.string().allow(null),
        operatorId: celebrate_1.Joi.string().allow(null),
        telemetryBoardId: celebrate_1.Joi.number().allow(null),
        incomePerMonthGoal: celebrate_1.Joi.number().allow(null),
        incomePerPrizeGoal: celebrate_1.Joi.number().allow(null),
        boxes: celebrate_1.Joi.array().items(celebrate_1.Joi.object({
            counters: celebrate_1.Joi.array().items({
                counterTypeId: celebrate_1.Joi.string().required(),
                hasMechanical: celebrate_1.Joi.boolean().required(),
                hasDigital: celebrate_1.Joi.boolean().required(),
                pin: celebrate_1.Joi.string().required(),
            }),
        })),
    },
}), create_machine_controller_1.default.handle);
machinesRouter.get('/', celebrate_1.celebrate({
    query: {
        categoryId: celebrate_1.Joi.string(),
        groupId: celebrate_1.Joi.string(),
        routeId: celebrate_1.Joi.string(),
        pointOfSaleId: celebrate_1.Joi.string().allow(null),
        serialNumber: celebrate_1.Joi.string(),
        isActive: celebrate_1.Joi.boolean().default(true),
        lean: celebrate_1.Joi.boolean().default(false),
        operatorId: celebrate_1.Joi.string().uuid(),
        telemetryStatus: celebrate_1.Joi.string().valid('ONLINE', 'OFFLINE', 'VIRGIN', 'NO_TELEMETRY'),
        limit: celebrate_1.Joi.number(),
        offset: celebrate_1.Joi.number(),
    },
}), list_machines_controller_1.default.handle);
machinesRouter.get('/:machineId', celebrate_1.celebrate({
    query: {
        period: celebrate_1.Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY'),
        startDate: celebrate_1.Joi.date(),
        endDate: celebrate_1.Joi.date(),
    },
    params: {
        machineId: celebrate_1.Joi.string().required(),
    },
}), get_machine_details_controller_1.default.handle);
machinesRouter.patch('/:machineId/fix-stock', fix_machine_stock_controller_1.default.validate, fix_machine_stock_controller_1.default.handle);
machinesRouter.put('/:machineId', celebrate_1.celebrate({
    body: {
        serialNumber: celebrate_1.Joi.string(),
        categoryId: celebrate_1.Joi.string(),
        typeOfPrizeId: celebrate_1.Joi.string().allow(null),
        minimumPrizeCount: celebrate_1.Joi.number().allow(null),
        gameValue: celebrate_1.Joi.number().positive(),
        locationId: celebrate_1.Joi.string().allow(null),
        operatorId: celebrate_1.Joi.string().allow(null),
        groupId: celebrate_1.Joi.string(),
        isActive: celebrate_1.Joi.boolean(),
        telemetryBoardId: celebrate_1.Joi.number().allow(null),
        maintenance: celebrate_1.Joi.boolean(),
        incomePerMonthGoal: celebrate_1.Joi.number().allow(null),
        incomePerPrizeGoal: celebrate_1.Joi.number().allow(null),
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
        machineId: celebrate_1.Joi.string().required(),
    },
}), edit_machine_controller_1.default.handle);
exports.default = machinesRouter;
