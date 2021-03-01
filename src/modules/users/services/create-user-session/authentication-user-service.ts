import authConfig from '@config/auth';

import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import AppError from '@shared/errors/app-error';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

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
    private usersRepository: UsersRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw AppError.incorrectEmailOrPassword;

    if (!this.hashProvider.compare(password, user.password))
      throw AppError.incorrectEmailOrPassword;

    const { secret, expiresIn } = authConfig.jwt;

    if (!secret) throw AppError.unknownError;

    const token = sign({}, secret, {
      subject: user._id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
