import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import SessionProvider from '@providers/session-provider/contracts/models/session.provider';
import AppError from '@shared/errors/app-error';
import { injectable, inject } from 'tsyringe';

interface Request {
  email: string;
  password: string;
}

interface Response {
  token: string;
  user: User;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('SessionProvider')
    private sessionProvider: SessionProvider,
  ) {}

  async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({
      by: 'email',
      value: email,
    });

    if (!user) throw AppError.incorrectEmailOrPassword;

    if (!user.isActive) throw AppError.incorrectEmailOrPassword;

    if (!this.hashProvider.compare(password, user.password))
      throw AppError.incorrectEmailOrPassword;

    const token = await this.sessionProvider.createToken(user.id);

    return {
      token,
      user,
    };
  }
}

export default AuthenticateUserService;
