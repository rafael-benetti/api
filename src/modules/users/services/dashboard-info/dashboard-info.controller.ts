import { Response, Request } from 'express';
import { container } from 'tsyringe';
import DashboardInfoService from './dashboard-info.service';

export default abstract class DashboardInfoController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const dashboardInfoService = container.resolve(DashboardInfoService);

    const response = await dashboardInfoService.execute({
      userId,
    });

    return res.json(response);
  }
}
