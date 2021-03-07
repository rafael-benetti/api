import Route from '@modules/routes/contracts/models/route';
import RoutesRepository from '@modules/routes/contracts/repositories/routes-repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
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

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({ userId, groupIds, label }: Request): Promise<Route> {
    const user = await this.usersRepository.findOne({
      filters: {
        _id: userId,
      },
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER) {
      if (user.role === Role.MANAGER) {
        if (user.ownerId === undefined) throw AppError.authorizationError;

        if (!user.permissions?.createRoutes) throw AppError.authorizationError;

        groupIds.forEach(groupId => {
          if (!user.groupIds?.includes(groupId))
            throw AppError.authorizationError;
        });
      }
    }

    const ownerId = user.role === Role.OWNER ? user._id : user.ownerId;

    if (!ownerId) throw AppError.authorizationError;

    const route = this.routesRepository.create({
      label,
      groupIds,
      ownerId,
    });

    await this.ormProvider.commit();

    return route;
  }
}

export default CreateRouteService;
