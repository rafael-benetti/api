"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const generate_collections_report_service_1 = __importDefault(require("./generate-collections-report.service"));
class GenerateCollectionsReportController {
}
GenerateCollectionsReportController.validate = celebrate_1.celebrate({
    query: {
        startDate: celebrate_1.Joi.date().iso().required(),
        endDate: celebrate_1.Joi.date().iso().required(),
        pointOfSaleId: celebrate_1.Joi.string().uuid().required(),
        download: celebrate_1.Joi.boolean().default(false),
    },
});
GenerateCollectionsReportController.handle = async (req, res) => {
    const { userId } = req;
    const { startDate, endDate, pointOfSaleId, download } = req.query;
    const generateCollectionsReportService = tsyringe_1.container.resolve(generate_collections_report_service_1.default);
    if (download) {
        const report = (await generateCollectionsReportService.execute({
            userId,
            startDate,
            endDate,
            download,
            pointOfSaleId,
        }));
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=relatorio.xlsx');
        return report.xlsx.write(res).then(() => {
            res.status(200).end();
        });
    }
    const report = await generateCollectionsReportService.execute({
        userId,
        pointOfSaleId,
        startDate,
        endDate,
        download,
    });
    return res.json(report);
};
exports.default = GenerateCollectionsReportController;
