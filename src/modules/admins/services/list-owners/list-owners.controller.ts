import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import ListOwnersService from './list-owners.service';

abstract class ListOwnersController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;

    const listOwners = container.resolve(ListOwnersService);

    const owners = await listOwners.execute({
      adminId: userId,
    });

    return res.json(owners);
  };
}

export default ListOwnersController;
