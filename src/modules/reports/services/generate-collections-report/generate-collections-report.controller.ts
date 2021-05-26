import { celebrate, Joi } from 'celebrate';
import { Response, Request } from 'express';
import { container } from 'tsyringe';
import GenerateCollectionsReportService from './generate-collections-report.service';

abstract class GenerateCollectionsReportController {
  static validate = celebrate({
    query: {
      startDate: Joi.date().iso().required(),
      endDate: Joi.date().iso().required(),
      pointOfSaleId: Joi.string().uuid().required(),
    },
  });

  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const { startDate, endDate, pointOfSaleId } = req.query as Record<
      string,
      never
    >;

    const generateCollectionsReportService = container.resolve(
      GenerateCollectionsReportService,
    );

    const report = await generateCollectionsReportService.execute({
      userId,
      pointOfSaleId,
      startDate,
      endDate,
    });

    return res.json(report);
  }
}

export default GenerateCollectionsReportController;
