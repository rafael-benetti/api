import CreateUserService from '@modules/users/services/CreateUserService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UsersController {
  public async create(req: Request, response: Response): Promise<Response> {
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
    });

    return response.json(user);
  }
}
