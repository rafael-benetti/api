import { Request, Response } from 'express';
import { container } from 'tsyringe';
import GetNumberOfNotificationsUnreadService from './get-numbers-notifications-unread.service';

abstract class GetNumberOfNotificationsUnreadController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const getNumberOfNotificationsUnreadService = container.resolve(
      GetNumberOfNotificationsUnreadService,
    );

    const notificationsCount = await getNumberOfNotificationsUnreadService.execute(
      userId,
    );

    return res.json(notificationsCount);
  }
}

export default GetNumberOfNotificationsUnreadController;
