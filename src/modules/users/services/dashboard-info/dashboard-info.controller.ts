import Period from '@modules/machines/contracts/dtos/period.dto';
import { celebrate, Joi } from 'celebrate';
import { Response, Request } from 'express';
import { container } from 'tsyringe';
import DashboardInfoService from './dashboard-info.service';

export default abstract class DashboardInfoController {
  static validate = celebrate({
    query: {
      startDate: Joi.date(),
      endDate: Joi.date(),
      period: Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY'),
    },
  });

  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const { startDate, endDate, period } = req.query;

    const dashboardInfoService = container.resolve(DashboardInfoService);

    const response = await dashboardInfoService.execute({
      userId,
      period: period as Period,
      endDate: new Date(endDate as string),
      startDate: new Date(startDate as string),
    });

    return res.json(response);
  }
}
