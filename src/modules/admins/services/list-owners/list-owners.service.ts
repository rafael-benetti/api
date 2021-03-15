import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import Role from '@modules/users/contracts/enums/role';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { injectable, inject } from 'tsyringe';

interface Request {
  adminId: string;
}

@injectable()
class ListOwnersService {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  async execute({ adminId }: Request): Promise<User[]> {
    const admin = await this.adminsRepository.findOne({
      by: 'id',
      value: adminId,
    });

    if (!admin) throw AppError.authorizationError;

    const owners = await this.usersRepository.find({
      filters: {
        role: Role.OWNER,
      },
    });

    return owners;
  }
}

export default ListOwnersService;
