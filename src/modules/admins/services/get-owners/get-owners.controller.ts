import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import GetOwnersService from './get-owners.service';

abstract class GetOwnersController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;

    const getOwners = container.resolve(GetOwnersService);

    const owners = await getOwners.execute({
      adminId: userId,
    });

    return res.json(owners);
  };
}

export default GetOwnersController;
