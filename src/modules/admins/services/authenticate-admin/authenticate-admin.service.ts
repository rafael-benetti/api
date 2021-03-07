import Admin from '@modules/admins/contracts/models/admin';
import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import SessionProvider from '@providers/session-provider/contracts/models/session.provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  email: string;
  password: string;
}

interface Response {
  admin: Admin;
  token: string;
}

@injectable()
class AuthenticateAdminService {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('SessionProvider')
    private sessionProvider: SessionProvider,
  ) {}

  public async execute({ email, password }: Request): Promise<Response> {
    const admin = await this.adminsRepository.findOne({
      filters: {
        email,
      },
    });

    if (!admin) throw AppError.incorrectEmailOrPassword;

    if (!this.hashProvider.compare(password, admin.password))
      throw AppError.incorrectEmailOrPassword;

    const token = await this.sessionProvider.createToken(admin._id);

    return { admin, token };
  }
}

export default AuthenticateAdminService;
