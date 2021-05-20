import { celebrate, Joi } from 'celebrate';
import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import GeneratePointsOfSaleReport from './generate-points-of-sale-report.service';

export default abstract class GeneratePointsOfSaleReportController {
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

    const generatePointsOfSaleReport = container.resolve(
      GeneratePointsOfSaleReport,
    );

    const report = await generatePointsOfSaleReport.execute({
      userId,
      groupId,
      startDate,
      endDate,
    });

    return response.json(report);
  };
}
