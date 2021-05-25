import { Request, Response } from 'express';
import { container } from 'tsyringe';
import NotificationsCountService from './get-notifications-count.service';

abstract class NotificationsCountController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const notificationsCountService = container.resolve(
      NotificationsCountService,
    );

    const notificationsCount = await notificationsCountService.execute(userId);

    return res.json(notificationsCount);
  }
}

export default NotificationsCountController;
