import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';

import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  routeId: string;
}

@injectable()
class DeleteRouteService {
  constructor(
    @inject('RoutesRepository')
    private routesRepository: RoutesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({ userId, routeId }: Request): Promise<void> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const route = await this.routesRepository.findOne({
      id: routeId,
    });

    if (!route) throw AppError.routeNotFound;

    if (user.role !== Role.MANAGER && user.role !== Role.OWNER)
      throw AppError.authorizationError;

    if (user.role === Role.MANAGER) {
      if (!user.permissions?.deleteRoutes) throw AppError.authorizationError;

      if (route.groupIds?.some(groupId => !user.groupIds?.includes(groupId)))
        throw AppError.authorizationError;
    }

    if (user.role === Role.OWNER) {
      const userGroups = await this.groupsRepository.find({
        filters: {
          ownerId: user.id,
        },
      });

      const userGrupIds = userGroups.map(group => group.id);

      if (route.groupIds.some(groupId => !userGrupIds.includes(groupId)))
        throw AppError.authorizationError;
    }

    const { pointsOfSale } = await this.pointsOfSaleRepository.find({
      by: 'routeId',
      value: route.id,
    });

    pointsOfSale.forEach(pointOfSale => {
      pointOfSale.routeId = undefined;
      this.pointsOfSaleRepository.save(pointOfSale);
    });

    this.routesRepository.delete(route);

    await this.ormProvider.commit();
  }
}
export default DeleteRouteService;
