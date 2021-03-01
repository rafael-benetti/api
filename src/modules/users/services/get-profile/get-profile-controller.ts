import { Request, Response } from 'express';
import { container } from 'tsyringe';
import GetProfileService from './get-profile-service';

abstract class GetProfileController {
  static async handle(req: Request, res: Response): Promise<Response> {
    const { userId } = req;

    const getProfileService = container.resolve(GetProfileService);

    const user = await getProfileService.execute({ userId });

    return res.json(user);
  }
}

export default GetProfileController;
