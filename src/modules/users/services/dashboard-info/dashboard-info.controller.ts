import Period from '@modules/machines/contracts/dtos/period.dto';
import { Response, Request } from 'express';
import { container } from 'tsyringe';
import DashboardInfoService from './dashboard-info.service';

export default abstract class DashboardInfoController {
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
