import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListGroupsService from './list-groups.service';

abstract class ListGroupsController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const listGroupsService = container.resolve(ListGroupsService);

    const groups = await listGroupsService.execute({ userId });

    return res.json(groups);
  }
}

export default ListGroupsController;
