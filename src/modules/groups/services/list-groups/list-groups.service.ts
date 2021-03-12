import Group from '@modules/groups/contracts/models/group';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  limit?: number;
  offset?: number;
}

@injectable()
class ListGroupsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,
  ) {}

  async execute({ userId, limit, offset }: Request): Promise<Group[]> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    console.log(user);

    if (user.role !== Role.OWNER) {
      const groups = await this.groupsRepository.find({
        filters: {
          ids: user.groupIds,
        },
        limit,
        offset,
      });

      return groups;
    }

    const groups = await this.groupsRepository.find({
      filters: {
        ownerId: user.id,
      },
      limit,
      offset,
    });

    return groups;
  }
}

export default ListGroupsService;
