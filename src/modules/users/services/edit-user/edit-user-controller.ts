import { Request, Response } from 'express';
import { container } from 'tsyringe';
import EditUserService from './edit-user-service';

class EditUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const targetUserId = req.query.userId;

    const { groupIds, name, password, phone, isActive, permissions } = req.body;

    const updateUserService = container.resolve(EditUserService);

    const user = await updateUserService.execute({
      userId,
      targetUserId: targetUserId as string,
      groupIds,
      name,
      password,
      phone,
      isActive,
      permissions,
    });

    return res.json(user);
  }
}

export default EditUserController;
