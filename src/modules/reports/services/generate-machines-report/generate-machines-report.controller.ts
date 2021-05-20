import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import GenerateMachinesReportService from './generate-machines-report.service';

export default abstract class GenerateMachinesController {
  static validate = celebrate({
    query: {
      startDate: Joi.date().iso(),
      endDate: Joi.date().iso(),
      groupId: Joi.string(),
    },
  });

  static handle: RequestHandler = async (request, response) => {
    const { userId } = request;
    const { startDate, endDate, groupId } = request.query as Record<
      string,
      never
    >;

    const generateMachinesReportService = container.resolve(
      GenerateMachinesReportService,
    );

    const report = await generateMachinesReportService.execute({
      userId,
      groupId,
      startDate,
      endDate,
    });

    return response.json(report);
  };
}
