"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const generate_stocks_report_service_1 = __importDefault(require("./generate-stocks-report.service"));
class GenerateStockReportController {
}
exports.default = GenerateStockReportController;
GenerateStockReportController.validate = celebrate_1.celebrate({
    query: {
        groupId: celebrate_1.Joi.string(),
        download: celebrate_1.Joi.boolean().default(false),
    },
});
GenerateStockReportController.handle = async (request, response) => {
    const { userId } = request;
    const { groupId, download } = request.query;
    const generateStockReportService = tsyringe_1.container.resolve(generate_stocks_report_service_1.default);
    if (download) {
        const report = (await generateStockReportService.execute({
            userId,
            groupId,
            download,
        }));
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=relarorio.xlsx');
        return report.xlsx.write(response).then(() => {
            response.status(200).end();
        });
    }
    const report = await generateStockReportService.execute({
        userId,
        groupId,
        download,
    });
    return response.json(report);
};
