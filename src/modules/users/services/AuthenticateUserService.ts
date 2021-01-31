import appConfig from '@config/auth';
import AppError from '@shared/errors/app-error';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw AppError.incorrectEmailOrPassword;
    }

    // TODO: descriptografar password.
    if (password !== user.password) {
      throw AppError.incorrectEmailOrPassword;
    }

    const { secret, expiresIn } = appConfig.jwt;

    if (!secret) {
      throw AppError.unknownError;
    }

    const token = sign({}, secret, {
      subject: user.id.toString(),
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
