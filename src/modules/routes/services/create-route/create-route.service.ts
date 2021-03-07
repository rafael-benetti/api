import logger from '@config/logger';
import GroupsRepository from '@modules/groups/contracts/repositories/groups-repository';
import Route from '@modules/routes/contracts/models/route';
import RoutesRepository from '@modules/routes/contracts/repositories/routes-repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  operatorId: string;
  label: string;
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

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    groupIds,
    label,
    operatorId,
  }: Request): Promise<Route> {
    logger.info('a');

    let ownerId;
    const user = await this.usersRepository.findOne({
      filters: {
        _id: userId,
      },
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && user.role !== Role.MANAGER)
      throw AppError.authorizationError;

    if (user.role === Role.OWNER) {
      const groups = await this.groupsRepository.find({
        filters: {
          ownerId: user._id,
        },
      });

      const ownerGroupIds = groups.map(group => group._id);

      groupIds.forEach(groupId => {
        if (!ownerGroupIds.includes(groupId)) throw AppError.authorizationError;
      });

      ownerId = user._id;
    }

    if (user.role === Role.MANAGER) {
      if (!user.permissions?.createRoutes) throw AppError.authorizationError;

      groupIds.forEach(groupId => {
        if (!user.groupIds?.includes(groupId))
          throw AppError.authorizationError;
      });

      ownerId = user.ownerId;
    }

    if (!ownerId) throw AppError.authorizationError;

    const route = this.routesRepository.create({
      label,
      groupIds,
      ownerId,
      operatorId,
    });

    await this.ormProvider.commit();

    return route;
  }
}

export default CreateRouteService;
