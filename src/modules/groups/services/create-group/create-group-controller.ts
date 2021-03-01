import { Response, Request } from 'express';
import { container } from 'tsyringe';
import CreateGroupService from './create-group-service';

class CreateGroupController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;
    const { name } = req.body;

    const createGroupService = container.resolve(CreateGroupService);

    const group = await createGroupService.execute({
      name,
      userId,
    });

    return res.json(group);
  }
}

export default CreateGroupController;
