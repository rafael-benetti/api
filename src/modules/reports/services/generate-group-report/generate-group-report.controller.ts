import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import GenerateGroupReportService from './generate-group-report.service';

export default abstract class GenerateGroupReportController {
  static validate = celebrate({
    query: {
      start_date: Joi.date().iso(),
      end_date: Joi.date().iso(),
    },
  });

  static handle: RequestHandler = async (request, response) => {
    const { userId } = request;
    const {
      start_date: startDate,
      end_date: endDate,
    } = request.query as Record<string, never>;

    const generateGroupReport = container.resolve(GenerateGroupReportService);

    const report = await generateGroupReport.execute({
      userId,
      dates: {
        startDate,
        endDate,
      },
    });

    return response.json(report);
  };
}
