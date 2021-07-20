import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  groupId?: string;
  routeId?: string;
  label?: string;
  operatorId?: string;
  limit: number;
  offset: number;
}

@injectable()
class ListPointsOfSaleService {
  constructor(
    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('RoutesRepository')
    private routesRepository: RoutesRepository,
  ) {}

  public async execute({
    userId,
    label,
    groupId,
    operatorId,
    routeId,
    limit,
    offset,
  }: Request): Promise<{ count: number; pointsOfSale: PointOfSale[] }> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    let pointsOfSaleIds: string[] | undefined;

    if ((operatorId || routeId) && user.role === Role.OPERATOR) {
      const routes = await this.routesRepository.find({
        operatorId,
        id: routeId,
      });

      pointsOfSaleIds = routes.flatMap(route => route.pointsOfSaleIds);
    }

    if (user.role === Role.OPERATOR) {
      pointsOfSaleIds = (
        await this.machinesRepository.find({
          operatorId: user.id,
        })
      )
        .filter(machine => machine.locationId !== undefined)
        .map(item => item.locationId) as string[];
    }

    if (user.role === Role.OWNER) {
      const response = await this.pointsOfSaleRepository.find({
        ...(pointsOfSaleIds && { by: 'id' }),
        ...(pointsOfSaleIds && { value: pointsOfSaleIds }),
        filters: {
          groupId,
          label,
          ownerId: user.id,
          limit,
          offset,
        },
      });

      return response;
    }

    if (user.groupIds) {
      const response = await this.pointsOfSaleRepository.find({
        ...(pointsOfSaleIds && { by: 'id' }),
        ...(pointsOfSaleIds && { value: pointsOfSaleIds }),
        filters: {
          groupId: groupId || user.groupIds,
          label,
          limit,
          offset,
        },
      });
      return response;
    }

    return { count: 0, pointsOfSale: [] };
  }
}
export default ListPointsOfSaleService;
