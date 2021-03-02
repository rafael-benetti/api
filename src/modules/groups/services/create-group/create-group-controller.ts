import { Response, Request } from 'express';
import { container } from 'tsyringe';
import CreateGroupService from './create-group-service';

abstract class CreateGroupController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { label } = req.body;

    const createGroupService = container.resolve(CreateGroupService);

    const group = await createGroupService.execute({
      label,
      userId,
    });

    return res.json(group);
  }
}

export default CreateGroupController;
