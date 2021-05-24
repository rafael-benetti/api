"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const generate_machines_report_service_1 = __importDefault(require("./generate-machines-report.service"));
class GenerateMachinesController {
}
exports.default = GenerateMachinesController;
GenerateMachinesController.validate = celebrate_1.celebrate({
    query: {
        startDate: celebrate_1.Joi.date().iso(),
        endDate: celebrate_1.Joi.date().iso(),
        groupId: celebrate_1.Joi.string(),
    },
});
GenerateMachinesController.handle = async (request, response) => {
    const { userId } = request;
    const { startDate, endDate, groupId } = request.query;
    const generateMachinesReportService = tsyringe_1.container.resolve(generate_machines_report_service_1.default);
    const report = await generateMachinesReportService.execute({
        userId,
        groupId,
        startDate,
        endDate,
    });
    return response.json(report);
};
