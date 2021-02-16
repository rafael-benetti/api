import ShowUserService from '@modules/users/services/ShowUserProfileService';
import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ProfileController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    let picture;
    try {
      picture = req.file.path;
    } catch (error) {
      picture = undefined;
    }

    const { name, password, phone, oldPassword } = req.body;

    const updateUserProfileService = container.resolve(
      UpdateUserProfileService,
    );

    const user = await updateUserProfileService.execute({
      name,
      password,
      oldPassword,
      phone,
      picture,
      userId,
    });

    return res.json(user);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const showUserService = container.resolve(ShowUserService);

    const user = await showUserService.execute(userId);

    return res.json(user);
  }
}

export default ProfileController;
