import Group from '@modules/groups/contracts/models/group';
import GroupsRepository from '@modules/groups/contracts/repositories/groups-repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  name: string;
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

  public async execute({ name, userId }: Request): Promise<Group> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER)
      if (user.role !== Role.MANAGER) throw AppError.authorizationError;
      else if (!user.permissions?.createGroups)
        throw AppError.authorizationError;

    const ownerId = user.role === Role.OWNER ? user._id : user.ownerId;

    if (!ownerId) throw AppError.unknownError;

    const checkNameAlreadyExists = await this.groupsRepository.findByName({
      ownerId,
      name,
    });

    if (checkNameAlreadyExists) throw AppError.nameAlreadyInUsed;

    const group = this.groupsRepository.create({
      name,
      ownerId,
    });

    await this.ormProvider.commit();

    return group;
  }
}
export default CreateGroupService;
