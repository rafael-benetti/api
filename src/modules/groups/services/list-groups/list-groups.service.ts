import Group from '@modules/groups/contracts/models/group';
import GroupsRepository from '@modules/groups/contracts/repositories/groups-repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
}

@injectable()
class ListGroupsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,
  ) {}

  public async execute({ userId }: Request): Promise<Group[]> {
    const user = await this.usersRepository.findOne({
      filters: {
        _id: userId,
      },
    });

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.MANAGER) {
      if (user.groupIds) {
        const groups = await this.groupsRepository.find({
          filters: {},
        });
        return groups;
      }

      return [];
    }

    if (user.role === Role.OWNER) {
      const groups = await this.groupsRepository.find({
        filters: {
          ownerId: userId,
        },
      });
      return groups;
    }

    throw AppError.authorizationError;
  }
}
export default ListGroupsService;
