import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import GenerateGroupReportService from './generate-group-report.service';

export default abstract class GenerateGroupReportController {
  static validate = celebrate({
    query: {
      startDate: Joi.date().iso(),
      endDate: Joi.date().iso(),
    },
  });

  static handle: RequestHandler = async (request, response) => {
    const { userId } = request;
    const { startDate, endDate } = request.query as Record<string, never>;

    const generateGroupReport = container.resolve(GenerateGroupReportService);

    const report = await generateGroupReport.execute({
      userId,
      startDate,
      endDate,
    });

    return response.json(report);
  };
}
