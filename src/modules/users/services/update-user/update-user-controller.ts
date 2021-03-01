import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserService from './update-user-service';

class UpdateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const targetUserId = req.query.userId;

    const { groups, name, password, phone, isActive, permissions } = req.body;

    const updateUserService = container.resolve(UpdateUserService);

    const user = await updateUserService.execute({
      userId,
      targetUserId: targetUserId as string,
      groups,
      name,
      password,
      phone,
      isActive,
      permissions,
    });

    return res.json(user);
  }
}

export default UpdateUserController;
