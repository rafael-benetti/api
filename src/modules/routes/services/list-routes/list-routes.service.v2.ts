/* eslint-disable no-restricted-globals */
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Route from '@modules/routes/contracts/models/route';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  groupId?: string;
  operatorId?: string;
  pointOfSaleId?: string;
  label?: string;
  limit: number;
  offset: number;
}

@injectable()
class ListRoutesServiceV2 {
  constructor(
    @inject('RoutesRepository')
    private routesRepository: RoutesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,
  ) {}

  public async execute({
    userId,
    groupId,
    operatorId,
    pointOfSaleId,
    label,
    limit,
    offset,
  }: Request): Promise<{ routes: Route[]; count: number }> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.MANAGER) {
      if (groupId) {
        if (!user.groupIds?.includes(groupId))
          throw AppError.authorizationError;
      }
      const routes = await this.routesRepository.find({
        groupIds: groupId ? [groupId] : user.groupIds,
        operatorId,
        pointsOfSaleId: pointOfSaleId,
        label,
      });
      // eslint-disable-next-line array-callback-return
      const filteredRoutes = routes.filter(route => {
        const checkRoutesGroups = route.groupIds.some(
          groupId => !user.groupIds?.includes(groupId),
        );

        if (!checkRoutesGroups) return route;
      });

      if (isNaN(offset) && isNaN(limit)) {
        return {
          routes: filteredRoutes,
          count: filteredRoutes.length,
        };
      }

      return {
        routes: filteredRoutes.slice(
          isNaN(offset) ? 0 : offset,
          isNaN(offset) ? limit + 0 : limit + offset,
        ),
        count: filteredRoutes.length,
      };
    }

    if (user.role === Role.OWNER) {
      if (groupId) {
        const group = await this.groupsRepository.findOne({
          by: 'id',
          value: groupId,
        });
        if (group?.ownerId !== user.id) throw AppError.authorizationError;
      }

      const result = await this.routesRepository.findAndCount({
        ownerId: user.id,
        groupIds: groupId ? [groupId] : undefined,
        operatorId,
        pointsOfSaleId: pointOfSaleId,
        label,
        offset,
        limit,
      });

      return result;
    }

    if (user.role === Role.OPERATOR) {
      if (groupId) {
        if (!user.groupIds?.includes(groupId))
          throw AppError.authorizationError;
      }
      const result = await this.routesRepository.findAndCount({
        operatorId: user.id,
        pointsOfSaleId: pointOfSaleId,
        label,
        offset,
        limit,
      });

      return result;
    }

    throw AppError.unknownError;
  }
}
export default ListRoutesServiceV2;
