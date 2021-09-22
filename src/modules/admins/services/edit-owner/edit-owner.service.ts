import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { injectable, inject } from 'tsyringe';

interface Request {
  ownerId: string;
  adminId: string;
  email: string;
  name: string;
  password: string;
}

@injectable()
class EditOwnerService {
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

  async execute({
    ownerId,
    email,
    name,
    password,
    adminId,
  }: Request): Promise<void> {
    const admin = await this.adminsRepository.findOne({
      by: 'id',
      value: adminId,
    });

    if (admin) throw AppError.authorizationError;

    const user = await this.usersRepository.findOne({
      by: 'id',
      value: ownerId,
    });

    if (!user) throw AppError.userNotFound;

    if (password) user.password = this.hashProvider.hash(password);

    if (email) user.name = email;

    if (name) user.name = name;

    this.usersRepository.save(user);

    await this.ormProvider.commit();
  }
}

export default EditOwnerService;
