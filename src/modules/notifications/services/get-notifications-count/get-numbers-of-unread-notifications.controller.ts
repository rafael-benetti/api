import { Request, Response } from 'express';
import { container } from 'tsyringe';
import GetNumberOfUnreadNotificationsService from './get-numbers-of-unread-notifications.service';

abstract class GetNumberOfUnreadNotificationsController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const getNumberOfUnreadNotificationsService = container.resolve(
      GetNumberOfUnreadNotificationsService,
    );

    const notificationsCount = await getNumberOfUnreadNotificationsService.execute(
      userId,
    );

    return res.json(notificationsCount);
  }
}

export default GetNumberOfUnreadNotificationsController;
