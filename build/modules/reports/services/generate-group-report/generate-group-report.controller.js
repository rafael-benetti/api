"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const generate_group_report_service_1 = __importDefault(require("./generate-group-report.service"));
class GenerateGroupReportController {
}
exports.default = GenerateGroupReportController;
GenerateGroupReportController.validate = celebrate_1.celebrate({
    query: {
        start_date: celebrate_1.Joi.date().iso(),
        end_date: celebrate_1.Joi.date().iso(),
    },
});
GenerateGroupReportController.handle = async (request, response) => {
    const { userId } = request;
    const { start_date: startDate, end_date: endDate, } = request.query;
    const generateGroupReport = tsyringe_1.container.resolve(generate_group_report_service_1.default);
    const report = await generateGroupReport.execute({
        userId,
        dates: {
            startDate,
            endDate,
        },
    });
    return response.json(report);
};
