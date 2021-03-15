import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import ListGroupsService from './list-groups.service';

abstract class ListGroupsController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { limit, offset } = req.query as { [key: string]: never };

    const listGroups = container.resolve(ListGroupsService);

    const groups = await listGroups.execute({
      userId,
      limit,
      offset,
    });

    return res.json(groups);
  };
}

export default ListGroupsController;
