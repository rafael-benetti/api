import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateAdminService from './authenticate-admin.service';

export default abstract class AuthenticateAdminController {
  public static async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authenticateAdminService = container.resolve(
      AuthenticateAdminService,
    );

    const { admin, token } = await authenticateAdminService.execute({
      email,
      password,
    });

    return res.json({
      admin,
      token,
    });
  }
}
