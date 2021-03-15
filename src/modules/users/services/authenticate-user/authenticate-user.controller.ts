import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import AuthenticateUserService from './authenticate-user.service';

abstract class AuthenticateUserController {
  static handle: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    const createSession = container.resolve(AuthenticateUserService);

    const { token, user } = await createSession.execute({
      email,
      password,
    });

    return res.json({ token, user });
  };
}

export default AuthenticateUserController;
