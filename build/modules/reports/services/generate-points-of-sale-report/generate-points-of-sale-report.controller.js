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
        download: celebrate_1.Joi.bool().default(false),
    },
});
GeneratePointsOfSaleReportController.handle = async (request, response) => {
    const { userId } = request;
    const { startDate, endDate, groupId, download } = request.query;
    const generatePointsOfSaleReport = tsyringe_1.container.resolve(generate_points_of_sale_report_service_1.default);
    if (download) {
        const report = (await generatePointsOfSaleReport.execute({
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
    const report = await generatePointsOfSaleReport.execute({
        userId,
        groupId,
        startDate,
        endDate,
        download,
    });
    return response.json(report);
};
