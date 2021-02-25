import { Response, Request } from 'express';
import { container } from 'tsyringe';
import CreateOwnerService from './CreateOwner.service';

class CreateOwnerController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createOwnerService = container.resolve(CreateOwnerService);

    const user = await createOwnerService.execute({ name, email, password });

    return res.json(user);
  }
}

export default CreateOwnerController;
