import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateNotificationService from './create-notification.service';

abstract class CreateNotificationController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { title, body, groupId, operatorId, machineId } = req.body;

    const createNotificationService = container.resolve(
      CreateNotificationService,
    );

    await createNotificationService.execute({
      title,
      body,
      operatorId,
      machineId,
      groupId,
    });

    return res.status(204).json();
  }
}

export default CreateNotificationController;
