import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserService from './authenticate-user.service';

export default abstract class AuthenticateUserController {
  public static async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authenticateUserService = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUserService.execute({
      email,
      password,
    });

    return res.json({
      user,
      token,
    });
  }
}
