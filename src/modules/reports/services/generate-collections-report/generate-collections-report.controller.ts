import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import ExcelJS from 'exceljs';
import GenerateCollectionsReportService from './generate-collections-report.service';

abstract class GenerateCollectionsReportController {
  static validate = celebrate({
    query: {
      startDate: Joi.date().iso().required(),
      endDate: Joi.date().iso().required(),
      pointOfSaleId: Joi.string().uuid().required(),
      download: Joi.boolean().default(false),
    },
  });

  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;

    const { startDate, endDate, pointOfSaleId, download } = req.query as Record<
      string,
      never
    >;

    const generateCollectionsReportService = container.resolve(
      GenerateCollectionsReportService,
    );
    if (download) {
      const report = (await generateCollectionsReportService.execute({
        userId,
        startDate,
        endDate,
        download,
        pointOfSaleId,
      })) as ExcelJS.Workbook;

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=relatorio.xlsx',
      );
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
}

export default GenerateCollectionsReportController;
