"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const period_dto_1 = __importDefault(require("../../../machines/contracts/dtos/period.dto"));
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const dashboard_info_service_1 = __importDefault(require("./dashboard-info.service"));
class DashboardInfoController {
    static async handle(req, res) {
        const { userId } = req;
        const { startDate, endDate, period } = req.query;
        const dashboardInfoService = tsyringe_1.container.resolve(dashboard_info_service_1.default);
        const response = await dashboardInfoService.execute({
            userId,
            period: period,
            endDate: new Date(endDate),
            startDate: new Date(startDate),
        });
        return res.json(response);
    }
}
exports.default = DashboardInfoController;
DashboardInfoController.validate = celebrate_1.celebrate({
    query: {
        startDate: celebrate_1.Joi.date(),
        endDate: celebrate_1.Joi.date(),
        period: celebrate_1.Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY'),
    },
});
