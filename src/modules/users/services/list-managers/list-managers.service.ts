import Role from '@modules/users/contracts/enums/role';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  groupId?: string;
  limit?: number;
  offset?: number;
}

@injectable()
class ListManagersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  async execute({ userId, groupId, limit, offset }: Request): Promise<User[]> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && !user.permissions?.listManagers)
      throw AppError.authorizationError;

    if (groupId && !user.groupIds?.includes(groupId))
      throw AppError.authorizationError;

    const managers = await this.usersRepository.find({
      filters: {
        role: Role.MANAGER,
        groupId,
      },
      limit,
      offset,
    });

    return managers;
  }
}

export default ListManagersService;
