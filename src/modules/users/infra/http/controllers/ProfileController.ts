import ShowUserService from '@modules/users/services/ShowUserProfileService';
import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ProfileController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const { name, password, phone } = req.body;
    const updateUserProfileService = container.resolve(
      UpdateUserProfileService,
    );

    const user = await updateUserProfileService.execute({
      name,
      password,
      phone,
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
