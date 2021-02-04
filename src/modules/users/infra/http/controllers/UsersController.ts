import CreateUserService from '@modules/users/services/CreateUserService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name,
      email,
      phone,
      username,
      password,
      isActive,
      roles,
      isOperator,
      picture,
      ownerId,
    } = req.body;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      name,
      email,
      phone,
      username,
      password,
      isActive,
      roles,
      isOperator,
      picture,
      ownerId,
    });

    return res.json(user);
  }
}
