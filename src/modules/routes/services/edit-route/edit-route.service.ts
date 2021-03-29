import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Route from '@modules/routes/contracts/models/route';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';

interface Request {
  userId: string;
  routeId: string;
  label?: string;
  operatorId?: string;
  machineIds: string[];
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

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({
    userId,
    routeId,
    label,
    operatorId,
    machineIds,
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

      if (user.groupIds?.some(groupId => !route.groupIds.includes(groupId)))
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

    const { machines } = await this.machinesRepository.find({
      id: machineIds || route.machineIds,
    });

    if (machineIds && machines.length !== machineIds.length)
      throw AppError.machineNotFound;

    if (machines.some(machine => !machine.locationId))
      throw AppError.unknownError;

    if (label) {
      const checkRouteExists = await this.routesRepository.findOne({
        label,
      });

      if (checkRouteExists) throw AppError.labelAlreadyInUsed;

      route.label = label;
    }
    const groupIds = [
      ...new Set(
        machineIds ? machines.map(machine => machine.groupId) : route.groupIds,
      ),
    ];

    if (groupIds !== undefined) {
      if (user.role === Role.MANAGER)
        if (user.groupIds?.some(groupId => !groupIds.includes(groupId)))
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
      const operator = await this.usersRepository.findOne({
        by: 'id',
        value: operatorId,
      });

      if (!operator) throw AppError.userNotFound;

      const checkOperatorAlreadyInRoute = await this.routesRepository.findOne({
        operatorId: user.id,
      });

      if (checkOperatorAlreadyInRoute) throw AppError.unknownError;

      if (groupIds.some(groupId => !operator?.groupIds?.includes(groupId)))
        throw AppError.authorizationError;
    }

    this.routesRepository.save(route);

    await this.ormProvider.commit();

    return route;
  }
}
export default EditRouteService;
