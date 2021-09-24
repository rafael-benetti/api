import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import SessionProvider from '@providers/session-provider/contracts/models/session.provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  adminId: string;
  userId: string;
}

@injectable()
class GetUserTokenService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,

    @inject('SessionProvider')
    private sessionProvider: SessionProvider,
  ) {}

  async execute({
    adminId,
    userId,
  }: Request): Promise<{ user: User; token: string }> {
    const admin = await this.adminsRepository.findOne({
      by: 'id',
      value: adminId,
    });

    if (!admin) throw AppError.authorizationError;

    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.authorizationError;

    const token = await this.sessionProvider.createToken(user.id);

    return {
      user,
      token,
    };
  }
}

export default GetUserTokenService;
