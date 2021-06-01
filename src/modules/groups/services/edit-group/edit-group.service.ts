import Group from '@modules/groups/contracts/models/group';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { injectable, inject } from 'tsyringe';

interface Request {
  userId: string;
  groupId: string;
  label?: string;
}

@injectable()
class EditGroupService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({ userId, groupId, label }: Request): Promise<Group> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (
      user.role !== Role.OWNER &&
      (!user.permissions?.editGroups || !user.groupIds?.includes(groupId))
    )
      throw AppError.authorizationError;

    const group = await this.groupsRepository.findOne({
      by: 'id',
      value: groupId,
    });

    if (!group) throw AppError.groupNotFound;

    if (label) group.label = label;

    this.groupsRepository.save(group);

    await this.ormProvider.commit();

    return group;
  }
}

export default EditGroupService;
