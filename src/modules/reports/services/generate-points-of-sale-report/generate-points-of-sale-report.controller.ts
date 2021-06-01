import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import ExcelJS from 'exceljs';
import GeneratePointsOfSaleReport from './generate-points-of-sale-report.service';

export default abstract class GeneratePointsOfSaleReportController {
  static validate = celebrate({
    query: {
      startDate: Joi.date().iso(),
      endDate: Joi.date().iso(),
      groupId: Joi.string(),
      download: Joi.bool().default(false),
      pointsOfSaleIds: Joi.array().items(Joi.string()),
    },
  });

  static handle: RequestHandler = async (request, response) => {
    const { userId } = request;
    const {
      startDate,
      endDate,
      groupId,
      download,
      pointsOfSaleIds,
    } = request.query as Record<string, never>;

    const generatePointsOfSaleReport = container.resolve(
      GeneratePointsOfSaleReport,
    );

    if (download) {
      const report = (await generatePointsOfSaleReport.execute({
        userId,
        groupId,
        startDate,
        endDate,
        download,
        pointsOfSaleIds,
      })) as ExcelJS.Workbook;

      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.setHeader(
        'Content-Disposition',
        'attachment; filename=relarorio.xlsx',
      );
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
      pointsOfSaleIds,
    });

    return response.json(report);
  };
}
