import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import ExcelJS from 'exceljs';
import GenerateGroupReportService from './generate-groups-report.service';

export default abstract class GenerateGroupReportController {
  static validate = celebrate({
    query: {
      startDate: Joi.date().iso(),
      endDate: Joi.date().iso(),
      download: Joi.boolean().default(false),
    },
  });

  static handle: RequestHandler = async (request, response) => {
    const { userId } = request;
    const { startDate, endDate, download } = request.query as Record<
      string,
      never
    >;

    const generateGroupReport = container.resolve(GenerateGroupReportService);

    if (download) {
      const report = (await generateGroupReport.execute({
        userId,
        startDate,
        endDate,
        download,
      })) as ExcelJS.Workbook;

      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.setHeader(
        'Content-Disposition',
        'attachment; filename=relatorio.xlsx',
      );
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
}
