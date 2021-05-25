import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import CreateManagerService from './create-manager.service';

abstract class CreateManagerController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { email, name, groupIds, permissions, phoneNumber } = req.body;

    const createManager = container.resolve(CreateManagerService);

    const manager = await createManager.execute({
      userId,
      email,
      name,
      groupIds,
      permissions,
      phoneNumber,
    });

    return res.status(201).json(manager);
  };
}

export default CreateManagerController;
