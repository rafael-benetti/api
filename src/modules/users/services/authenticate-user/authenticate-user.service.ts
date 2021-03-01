import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import SessionProvider from '@providers/session-provider/contracts/models/session.provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  email: string;
  password: string;
}

interface Response {
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

    @inject('SessionProvider')
    private sessionProvider: SessionProvider,
  ) {}

  public async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw AppError.incorrectEmailOrPassword;

    if (!this.hashProvider.compare(password, user.password))
      throw AppError.incorrectEmailOrPassword;

    const token = await this.sessionProvider.createToken(user._id);

    return { user, token };
  }
}

export default AuthenticateUserService;
