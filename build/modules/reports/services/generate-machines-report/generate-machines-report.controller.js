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
        startDate: celebrate_1.Joi.date().iso().required(),
        endDate: celebrate_1.Joi.date().iso().required(),
        groupId: celebrate_1.Joi.string(),
        download: celebrate_1.Joi.bool().default(false),
    },
});
GenerateMachinesController.handle = async (request, response) => {
    const { userId } = request;
    const { startDate, endDate, groupId, download } = request.query;
    const generateMachinesReportService = tsyringe_1.container.resolve(generate_machines_report_service_1.default);
    if (download) {
        const report = (await generateMachinesReportService.execute({
            userId,
            groupId,
            startDate,
            endDate,
            download,
        }));
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=relarorio.xlsx');
        return report.xlsx.write(response).then(() => {
            response.status(200).end();
        });
    }
    const report = await generateMachinesReportService.execute({
        userId,
        groupId,
        startDate,
        endDate,
        download,
    });
    return response.json(report);
};
