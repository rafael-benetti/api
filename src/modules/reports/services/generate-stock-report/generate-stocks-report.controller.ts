import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import ExcelJS from 'exceljs';
import GenerateStockReportService from './generate-stocks-report.service';

export default abstract class GenerateStockReportController {
  static validate = celebrate({
    query: {
      groupId: Joi.string(),
      download: Joi.boolean().default(false),
    },
  });

  static handle: RequestHandler = async (request, response) => {
    const { userId } = request;
    const { groupId, download } = request.query as Record<string, never>;

    const generateStockReportService = container.resolve(
      GenerateStockReportService,
    );

    if (download) {
      const report = (await generateStockReportService.execute({
        userId,
        groupId,
        download,
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

    const report = await generateStockReportService.execute({
      userId,
      groupId,
      download,
    });

    return response.json(report);
  };
}
