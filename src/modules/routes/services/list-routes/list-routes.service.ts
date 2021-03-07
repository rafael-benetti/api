import logger from '@config/logger';
import Route from '@modules/routes/contracts/models/route';
import RoutesRepository from '@modules/routes/contracts/repositories/routes-repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users-repository';
import AppError from '@shared/errors/app-error';
import { injectable, inject } from 'tsyringe';

@injectable()
class ListRoutesService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('RoutesRepository')
    private routesRepository: RoutesRepository,
  ) {}

  async execute(userId: string): Promise<Route[]> {
    const user = await this.usersRepository.findOne({
      filters: { _id: userId },
    });

    if (!user) throw AppError.userNotFound;

    if (
      user.role !== Role.OPERATOR &&
      user.role !== Role.OWNER &&
      user.role !== Role.MANAGER
    )
      throw AppError.authorizationError;

    if (user.role === Role.OWNER) {
      const routes = await this.routesRepository.find({
        filters: {
          ownerId: user._id,
        },
      });

      logger.info(routes);

      return routes;
    }

    if (user.role === Role.MANAGER) {
      if (!user.groupIds) return [];

      logger.info(user.groupIds);
      const routes = await this.routesRepository.findByGroupIds(user.groupIds);

      return routes;
    }

    if (user.role === Role.OPERATOR) {
      const routes = await this.routesRepository.find({
        filters: { operatorId: user._id },
      });

      return routes;
    }

    return [];
  }
}

export default ListRoutesService;
