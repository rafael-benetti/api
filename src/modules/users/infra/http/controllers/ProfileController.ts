import ShowUserService from '@modules/users/services/ShowUserProfileService';
import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

interface AWSFileInfo {
  location: string;
}

class ProfileController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const photo = (req?.file as unknown) as AWSFileInfo;

    const { name, password, phone, oldPassword } = req.body;

    const updateUserProfileService = container.resolve(
      UpdateUserProfileService,
    );

    const user = await updateUserProfileService.execute({
      name,
      password,
      oldPassword,
      phone,
      photo: photo.location,
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
