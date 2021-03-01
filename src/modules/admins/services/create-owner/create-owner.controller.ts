import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import CreateOwnerService from './create-owner.service';

abstract class CreateOwnerController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { email, name } = req.body;

    const createOwner = container.resolve(CreateOwnerService);

    const owner = await createOwner.execute({
      adminId: userId,
      email,
      name,
    });

    return res.json(owner);
  };
}

export default CreateOwnerController;
