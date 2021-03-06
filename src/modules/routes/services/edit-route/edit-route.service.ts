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
import LogType from '@modules/logs/contracts/enums/log-type.enum';
import LogsRepository from '@modules/logs/contracts/repositories/logs-repository';

interface Request {
  userId: string;
  routeId: string;
  label?: string;
  operatorId?: string;
  pointsOfSaleIds: string[];
}

@injectable()
class EditRouteService {
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

    @inject('LogsRepository')
    private logsRepository: LogsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({
    userId,
    routeId,
    label,
    operatorId,
    pointsOfSaleIds,
  }: Request): Promise<Route> {
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
      if (!user.permissions?.editRoutes) throw AppError.authorizationError;

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
      by: 'id',
      value: pointsOfSaleIds,
    });

    if (pointsOfSaleIds && pointsOfSale.length !== pointsOfSaleIds.length)
      throw AppError.pointOfSaleNotFound;

    if (label && label !== route.label) {
      const checkRouteExists = await this.routesRepository.findOne({
        label,
        ownerId: route.ownerId,
      });

      if (checkRouteExists) throw AppError.labelAlreadyInUsed;

      route.label = label;
    }

    const groupIds = [
      ...new Set(
        pointsOfSaleIds
          ? pointsOfSale.map(pointOfSale => pointOfSale.groupId)
          : route.groupIds,
      ),
    ];

    if (groupIds !== undefined) {
      if (user.role === Role.MANAGER)
        if (groupIds?.some(groupId => !user.groupIds?.includes(groupId)))
          throw AppError.authorizationError;

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

      route.groupIds = groupIds;
    }

    if (operatorId !== undefined) {
      if (operatorId === null && route.operatorId !== null) {
        const machines = await this.machinesRepository.find({
          operatorId: route.operatorId,
          routeId: route.id,
        });

        machines.forEach(machine => {
          machine.operatorId = undefined;
          this.machinesRepository.save(machine);
        });

        route.operatorId = undefined;
      } else {
        const operator = await this.usersRepository.findOne({
          by: 'id',
          value: operatorId,
        });

        if (!operator) throw AppError.userNotFound;

        if (groupIds.some(groupId => !operator?.groupIds?.includes(groupId)))
          throw AppError.authorizationError;

        route.operatorId = operatorId;
      }
    }

    if (pointsOfSaleIds) {
      pointsOfSale.forEach(pointOfSale => {
        pointOfSale.routeId = route.id;
        this.pointsOfSaleRepository.save(pointOfSale);
      });

      const machines = await this.machinesRepository.find({
        pointOfSaleId: pointsOfSaleIds,
      });

      machines.forEach(machine => {
        machine.operatorId = operatorId || route.operatorId;
        this.machinesRepository.save(machine);
      });

      const pointsOfSaleToEditIds = route.pointsOfSaleIds.filter(
        pointOfSaleId => !pointsOfSaleIds.includes(pointOfSaleId),
      );

      const pointsOfSaleToEdit = (
        await this.pointsOfSaleRepository.find({
          by: 'id',
          value: pointsOfSaleToEditIds,
        })
      ).pointsOfSale;

      pointsOfSaleToEdit.forEach(p => {
        p.routeId = undefined;
        this.pointsOfSaleRepository.save(p);
      });

      const newPos = pointsOfSale.filter(
        newPos => !route.pointsOfSaleIds.includes(newPos.id),
      );

      newPos.forEach(pos => {
        this.logsRepository.create({
          createdBy: user.id,
          ownerId: user.ownerId || user.id,
          type: LogType.ADD_POS_TO_ROUTE,
          posId: pos.id,
          destinationId: route.id,
          groupId: pos.groupId,
        });
      });

      route.pointsOfSaleIds = pointsOfSaleIds;
    }

    this.routesRepository.save(route);

    this.logsRepository.create({
      createdBy: user.id,
      groupId: undefined,
      ownerId: route.ownerId,
      type: LogType.EDIT_ROUTE,
      routeId: route.id,
    });

    await this.ormProvider.commit();

    return route;
  }
}
export default EditRouteService;
