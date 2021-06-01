import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import ExcelJS from 'exceljs';
import GenerateMachinesReportService from './generate-machines-report.service';

export default abstract class GenerateMachinesController {
  static validate = celebrate({
    query: {
      startDate: Joi.date().iso().required(),
      endDate: Joi.date().iso().required(),
      groupId: Joi.string(),
      download: Joi.bool().default(false),
      machineIds: Joi.array().items(Joi.string()),
    },
  });

  static handle: RequestHandler = async (request, response) => {
    const { userId } = request;
    const {
      startDate,
      endDate,
      groupId,
      download,
      machineIds,
    } = request.query as Record<string, never>;

    const generateMachinesReportService = container.resolve(
      GenerateMachinesReportService,
    );

    if (download) {
      const report = (await generateMachinesReportService.execute({
        userId,
        groupId,
        startDate,
        endDate,
        download,
        machineIds,
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

    const report = await generateMachinesReportService.execute({
      userId,
      groupId,
      startDate,
      endDate,
      download,
      machineIds,
    });

    return response.json(report);
  };
}
