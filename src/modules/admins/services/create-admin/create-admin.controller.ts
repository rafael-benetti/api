import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import CreateAdminService from './create-admin.service';

abstract class CreateAdminController {
  static handle: RequestHandler = async (req, res) => {
    const { email, name } = req.body;

    const createAdmin = container.resolve(CreateAdminService);

    const admin = await createAdmin.execute({
      email,
      name,
    });

    return res.json(admin);
  };
}

export default CreateAdminController;
