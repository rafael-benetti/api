import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateNotificationService from './create-notification.service';

abstract class CreateNotificationController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { machineId } = req.params;
    const { title, body, groupId } = req.body;

    const createNotificationService = container.resolve(
      CreateNotificationService,
    );

    await createNotificationService.execute({
      title,
      body,
      machineId,
      groupId,
    });

    return res.status(204).json();
  }
}

export default CreateNotificationController;
