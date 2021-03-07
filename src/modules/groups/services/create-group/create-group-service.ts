import Group from '@modules/groups/contracts/models/group';
import GroupsRepository from '@modules/groups/contracts/repositories/groups-repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
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
    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({ label, userId }: Request): Promise<Group> {
    const user = await this.usersRepository.findOne({
      filters: {
        _id: userId,
      },
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER)
      if (user.role !== Role.MANAGER) throw AppError.authorizationError;
      else if (!user.permissions?.createGroups)
        throw AppError.authorizationError;

    const ownerId = user.role === Role.OWNER ? user._id : user.ownerId;

    if (!ownerId) throw AppError.unknownError;

    const checkNameAlreadyExists = await this.groupsRepository.findOne({
      filters: {
        ownerId,
        label,
      },
    });

    if (checkNameAlreadyExists) throw AppError.nameAlreadyInUsed;

    const group = this.groupsRepository.create({
      label,
      ownerId,
    });

    await this.ormProvider.commit();

    return group;
  }
}
export default CreateGroupService;
