import Route from '@modules/routes/contracts/models/route';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
}

@injectable()
class ListRoutesService {
  constructor(
    @inject('RoutesRepository')
    private routesRepository: RoutesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  public async execute({ userId }: Request): Promise<Route[]> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.MANAGER) {
      const routes = await this.routesRepository.find({
        groupIds: user.groupIds,
      });
      // eslint-disable-next-line array-callback-return
      const filteredRoutes = routes.filter(route => {
        const checkRoutesGroups = route.groupIds.some(
          groupId => !user.groupIds?.includes(groupId),
        );

        if (!checkRoutesGroups) return route;
      });

      return filteredRoutes;
    }

    if (user.role === Role.OWNER) {
      const routes = await this.routesRepository.find({
        ownerId: user.id,
      });

      return routes;
    }

    if (user.role === Role.OPERATOR) {
      const routes = await this.routesRepository.find({
        operatorId: user.id,
      });

      return routes;
    }

    throw AppError.unknownError;
  }
}
export default ListRoutesService;
