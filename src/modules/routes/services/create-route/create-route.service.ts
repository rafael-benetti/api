import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Route from '@modules/routes/contracts/models/route';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';

interface Request {
  userId: string;
  pointsOfSaleIds: string[];
  label: string;
  operatorId: string;
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

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({
    userId,
    label,
    pointsOfSaleIds,
    operatorId,
  }: Request): Promise<Route> {
    // ? Verificação de usuario existente
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    // ? Verificação de roles com autorização
    if (user.role !== Role.MANAGER && user.role !== Role.OWNER)
      throw AppError.authorizationError;

    const { pointsOfSale } = await this.pointsOfSaleRepository.find({
      by: 'id',
      value: pointsOfSaleIds,
    });

    if (pointsOfSale.length !== pointsOfSaleIds.length)
      throw AppError.pointOfSaleNotFound;

    const groupIds = [
      ...new Set(pointsOfSale.map(pointOfSale => pointOfSale.groupId)),
    ];

    if (user.role === Role.MANAGER) {
      if (!user.permissions?.createRoutes) throw AppError.authorizationError;
      if (!user.groupIds) throw AppError.unknownError;
      if (groupIds.some(groupId => !user.groupIds?.includes(groupId)))
        throw AppError.authorizationError;
    }

    if (user.role === Role.OWNER) {
      const userGroups = await this.groupsRepository.find({
        filters: {
          ownerId: user.id,
        },
      });

      const userGrupIds = userGroups.map(group => group.id);

      if (groupIds.some(groupId => !userGrupIds.includes(groupId)))
        throw AppError.authorizationError;
    }

    const ownerId = user.role === Role.OWNER ? user.id : user.ownerId;

    if (!ownerId) throw AppError.unknownError;

    const checkRouteExists = await this.routesRepository.findOne({
      label,
      ownerId,
    });

    if (checkRouteExists) throw AppError.labelAlreadyInUsed;

    if (operatorId) {
      const operator = await this.usersRepository.findOne({
        by: 'id',
        value: operatorId,
      });

      if (!operator) throw AppError.userNotFound;

      if (groupIds.some(groupId => !operator?.groupIds?.includes(groupId)))
        throw AppError.authorizationError;
    }

    if (pointsOfSale.some(pointOfSale => pointOfSale.routeId !== undefined))
      throw AppError.pointOfSaleBelongsToARoute;

    const route = this.routesRepository.create({
      groupIds,
      label,
      pointsOfSaleIds,
      operatorId,
      ownerId,
    });

    pointsOfSale.forEach(pointOfSale => {
      pointOfSale.routeId = route.id;
      this.pointsOfSaleRepository.save(pointOfSale);
    });

    const { machines } = await this.machinesRepository.find({
      pointOfSaleId: pointsOfSaleIds,
    });

    machines.forEach(machine => {
      machine.operatorId = operatorId;
      this.machinesRepository.save(machine);
    });

    await this.ormProvider.commit();

    return route;
  }
}
export default CreateRouteService;
