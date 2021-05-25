import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListNotificationsService from './list-notifications.service';

abstract class ListNotificationsController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { limit, offset } = req.query;

    const listNotificationsService = container.resolve(
      ListNotificationsService,
    );

    const notifications = await listNotificationsService.execute({
      userId,
      limit: Number(limit),
      offset: Number(offset),
    });

    return res.json(notifications);
  }
}

export default ListNotificationsController;
