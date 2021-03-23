import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Route from '@modules/routes/contracts/models/route';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  groupIds: string[];
}

@injectable()
class CreateRouteService {
  constructor(
    @inject('RoutesRepository')
    private routesRepository: RoutesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,
  ) {}

  public async execute({ userId, groupIds }: Request): Promise<Route> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.MANAGER && user.role !== Role.OWNER)
      throw AppError.authorizationError;

    if (user.role === Role.MANAGER) {
      if (!user.permissions?.createRoutes) throw AppError.authorizationError;
      if (!user.groupIds) throw AppError.unknownError;

      if (user.groupIds.some(groupId => !groupIds.includes(groupId)))
        throw AppError.authorizationError;
    }

    if (user.role === Role.OWNER) {
      const groups = await this.groupsRepository.find({
        filters: {
          ownerId: user.id,
        },
      });

      if (groups.some(group => !groupIds.includes(group.id)))
        throw AppError.authorizationError;
    }
  }
}
export default CreateRouteService;
