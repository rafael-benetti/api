import Group from '@modules/groups/contracts/models/group';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  label: string;
}

@injectable()
class CreateGroupService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({ userId, label }: Request): Promise<Group> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && !user.permissions?.createGroups)
      throw AppError.authorizationError;

    const group = this.groupsRepository.create({
      label,
      isPersonal: false,
      ownerId: user.ownerId || user.id,
    });

    if (user.role !== Role.OWNER) {
      user.groupIds?.push(group.id);
      this.usersRepository.save(user);
    }

    await this.ormProvider.commit();

    return group;
  }
}

export default CreateGroupService;
