import { container } from 'tsyringe';
import { Request, Response } from 'express';
import EditProfileService from './edit-profile.service';

abstract class EditProfileController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId, file } = req;
    const { name, phone, password, oldPassword } = req.body;

    const editProfileService = container.resolve(EditProfileService);

    const user = await editProfileService.execute({
      userId,
      name,
      phone,
      password,
      oldPassword,
      file,
    });

    return res.json(user);
  }
}

export default EditProfileController;
