import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import UpdateUserProfileService from './update-user-profile.service';

abstract class UpdateUserProfileController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;
    const { name, password, file, phoneNumber } = req.body;

    const updateUserProfile = container.resolve(UpdateUserProfileService);

    const user = await updateUserProfile.execute({
      userId,
      name,
      password,
      file,
      phoneNumber,
    });

    return res.json(user);
  };
}

export default UpdateUserProfileController;
