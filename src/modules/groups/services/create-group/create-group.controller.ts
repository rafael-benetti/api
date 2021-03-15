import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import CreateGroupService from './create-group.service';

abstract class CreateGroupController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { label } = req.body;

    const createGroup = container.resolve(CreateGroupService);

    const group = await createGroup.execute({
      userId,
      label,
    });

    return res.status(201).json(group);
  };
}

export default CreateGroupController;
