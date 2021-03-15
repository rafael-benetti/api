import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import GetUserProfileService from './get-user-profile.service';

abstract class GetUserProfileController {
  static handle: RequestHandler = async (req, res) => {
    const { userId } = req;

    const getUserProfile = container.resolve(GetUserProfileService);

    const user = await getUserProfile.execute({
      userId,
    });

    return res.json(user);
  };
}

export default GetUserProfileController;
