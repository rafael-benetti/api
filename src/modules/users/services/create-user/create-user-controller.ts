import { container } from 'tsyringe';
import { Request, Response } from 'express';
import CreateUserService from './create-user-service';

class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const {
      email,
      password,
      name,
      phone,
      role,
      photo,
      isActive,
      permissions,
      groupIds,
    } = req.body;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      userId,
      email,
      isActive,
      name,
      password,
      role,
      phone,
      photo,
      permissions,
      groupIds,
    });

    return res.json(user);
  }
}

export default CreateUserController;
