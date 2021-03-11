import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import ListManagersService from './list-managers.service';

abstract class ListManagersController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { groupId, limit, offset } = req.query as { [key: string]: never };

    const listManagers = container.resolve(ListManagersService);

    const managers = await listManagers.execute({
      userId,
      groupId,
      limit,
      offset,
    });

    return res.json(managers);
  };
}

export default ListManagersController;
