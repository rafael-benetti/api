import { container } from 'tsyringe';
import { Request, Response } from 'express';
import ListUsersService from './list-users-service';

abstract class ListUsersController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const listUsersService = container.resolve(ListUsersService);
    const users = await listUsersService.execute(userId);

    return res.json(users);
  }
}

export default ListUsersController;
