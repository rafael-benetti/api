import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import GenerateStockReportService from './generate-stock-report.service';

export default abstract class GenerateStockReportController {
  static validate = celebrate({
    query: {
      groupId: Joi.string(),
    },
  });

  static handle: RequestHandler = async (request, response) => {
    const { userId } = request;
    const { groupId } = request.query as Record<string, never>;

    const generateStockReportService = container.resolve(
      GenerateStockReportService,
    );

    const report = await generateStockReportService.execute({
      userId,
      groupId,
    });

    return response.json(report);
  };
}
