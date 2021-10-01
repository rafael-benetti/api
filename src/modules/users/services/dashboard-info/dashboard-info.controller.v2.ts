import Period from '@modules/machines/contracts/dtos/period.dto';
import { celebrate, Joi } from 'celebrate';
import { Response, Request } from 'express';
import { container } from 'tsyringe';
import DashboardInfoServiceV2 from './dashboard-info.service.v2';

export default abstract class DashboardInfoControllerV2 {
  static validate = celebrate({
    query: {
      period: Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY'),
      startDate: Joi.date(),
      endDate: Joi.date(),
      groupId: Joi.string().uuid(),
      routeId: Joi.string().uuid(),
      pointOfSaleId: Joi.string().uuid(),
    },
  });

  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const { startDate, endDate, period, groupId, routeId, pointOfSaleId } =
      req.query;

    const dashboardInfoService = container.resolve(DashboardInfoServiceV2);

    const response = await dashboardInfoService.execute({
      userId,
      period: period as Period,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      groupId: groupId as string,
      routeId: routeId as string,
      pointOfSaleId: pointOfSaleId as string,
    });

    return res.json(response);
  }
}
