"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const generate_points_of_sale_report_service_1 = __importDefault(require("./generate-points-of-sale-report.service"));
class GeneratePointsOfSaleReportController {
}
exports.default = GeneratePointsOfSaleReportController;
GeneratePointsOfSaleReportController.validate = celebrate_1.celebrate({
    query: {
        startDate: celebrate_1.Joi.date().iso(),
        endDate: celebrate_1.Joi.date().iso(),
        groupId: celebrate_1.Joi.string(),
    },
});
GeneratePointsOfSaleReportController.handle = async (request, response) => {
    const { userId } = request;
    const { startDate, endDate, groupId } = request.query;
    const generatePointsOfSaleReport = tsyringe_1.container.resolve(generate_points_of_sale_report_service_1.default);
    const report = await generatePointsOfSaleReport.execute({
        userId,
        groupId,
        startDate,
        endDate,
    });
    return response.json(report);
};
