import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import UpdateUserProfileService from './update-user-profile.service';

abstract class UpdateUserProfileController {
  static handle: RequestHandler = async (req, res) => {
    const { userId, file } = req;
    const { name, newPassword, password, phoneNumber } = req.body;

    const updateUserProfile = container.resolve(UpdateUserProfileService);

    const user = await updateUserProfile.execute({
      userId,
      name,
      password: newPassword
        ? {
            new: newPassword,
            old: password,
          }
        : undefined,
      file,
      phoneNumber,
    });

    return res.json(user);
  };
}

export default UpdateUserProfileController;
