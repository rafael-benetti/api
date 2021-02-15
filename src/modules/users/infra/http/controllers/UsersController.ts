import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
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

  public async update(req: Request, res: Response): Promise<Response> {
    const { userId } = req.query;
    const { name, password, phone, email, isActive, companyIds } = req.body;

    const updateUserService = container.resolve(UpdateUserService);

    const user = await updateUserService.execute({
      userId: Number(userId),
      name,
      password,
      phone,
      email,
      isActive,
      companyIds,
    });

    // TODO: adicionar ClassTransform
    return res.json(user);
  }
}
