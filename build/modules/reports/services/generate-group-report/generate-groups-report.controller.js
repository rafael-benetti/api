"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const generate_groups_report_service_1 = __importDefault(require("./generate-groups-report.service"));
class GenerateGroupReportController {
}
exports.default = GenerateGroupReportController;
GenerateGroupReportController.validate = celebrate_1.celebrate({
    query: {
        startDate: celebrate_1.Joi.date().iso(),
        endDate: celebrate_1.Joi.date().iso(),
        download: celebrate_1.Joi.boolean().default(false),
    },
});
GenerateGroupReportController.handle = async (request, response) => {
    const { userId } = request;
    const { startDate, endDate, download } = request.query;
    const generateGroupReport = tsyringe_1.container.resolve(generate_groups_report_service_1.default);
    if (download) {
        const report = (await generateGroupReport.execute({
            userId,
            startDate,
            endDate,
            download,
        }));
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=relatorio.xlsx');
        return report.xlsx.write(response).then(() => {
            response.status(200).end();
        });
    }
    const report = await generateGroupReport.execute({
        userId,
        startDate,
        endDate,
        download,
    });
    return response.json(report);
};
