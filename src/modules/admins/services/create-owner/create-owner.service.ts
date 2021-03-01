import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { injectable, inject } from 'tsyringe';

interface Request {
  adminId: string;
  email: string;
  name: string;
}

@injectable()
class CreateOwnerService {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({ adminId, email, name }: Request): Promise<void> {
    const admin = await this.adminsRepository.findOne({
      by: '_id',
      value: adminId,
    });

    if (!admin) throw AppError.authorizationError;

    await this.usersRepository.create({
      email,
      password: this.hashProvider.hash('123s'),
      name,
      isActive: true,
      role: Role.OWNER,
    });

    await this.ormProvider.commit();
  }
}

export default CreateOwnerService;
