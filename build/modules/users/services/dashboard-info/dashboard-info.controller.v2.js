"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const period_dto_1 = __importDefault(require("../../../machines/contracts/dtos/period.dto"));
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const dashboard_info_service_v2_1 = __importDefault(require("./dashboard-info.service.v2"));
class DashboardInfoControllerV2 {
    static async handle(req, res) {
        const { userId } = req;
        const { startDate, endDate, period, groupId, routeId, pointOfSaleId } = req.query;
        const dashboardInfoService = tsyringe_1.container.resolve(dashboard_info_service_v2_1.default);
        const response = await dashboardInfoService.execute({
            userId,
            period: period,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            groupId: groupId,
            routeId: routeId,
            pointOfSaleId: pointOfSaleId,
        });
        return res.json(response);
    }
}
exports.default = DashboardInfoControllerV2;
DashboardInfoControllerV2.validate = celebrate_1.celebrate({
    query: {
        period: celebrate_1.Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY'),
        startDate: celebrate_1.Joi.date(),
        endDate: celebrate_1.Joi.date(),
        groupId: celebrate_1.Joi.string().uuid(),
        routeId: celebrate_1.Joi.string().uuid(),
        pointOfSaleId: celebrate_1.Joi.string().uuid(),
    },
});
