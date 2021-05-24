import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateNotificationService from './create-notification.service';

abstract class CreateNotificationController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { machineId } = req.params;
    const { title, body, topic, type } = req.body;

    const createNotificationService = container.resolve(
      CreateNotificationService,
    );

    await createNotificationService.execute({
      body,
      machineId,
      title,
    });

    return res.status(204).json();
  }
}

export default CreateNotificationController;
