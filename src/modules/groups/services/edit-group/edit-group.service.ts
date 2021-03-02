import Group from '@modules/groups/contracts/models/group';
import GroupsRepository from '@modules/groups/contracts/repositories/groups-repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { injectable, inject } from 'tsyringe';

interface Request {
  userId: string;
  groupId: string;
  name: string;
}

@injectable()
class EditGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({ name, userId, groupId }: Request): Promise<Group> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER)
      if (user.role !== Role.MANAGER) throw AppError.authorizationError;
      else if (!user.permissions?.editGroups) throw AppError.authorizationError;

    const ownerId = user.role === Role.OWNER ? user._id : user.ownerId;

    if (!ownerId) throw AppError.unknownError;

    const group = await this.groupsRepository.findById(groupId);

    if (!group) throw AppError.groupNotFound;

    if (name && name !== group.name) {
      const checkGroupNameExists = await this.groupsRepository.findByName({
        name,
        ownerId,
      });

      if (checkGroupNameExists) throw AppError.nameAlreadyInUsed;

      group.name = name;
    }

    this.groupsRepository.save(group);

    await this.ormProvider.commit();

    return group;
  }
}
export default EditGroupService;
