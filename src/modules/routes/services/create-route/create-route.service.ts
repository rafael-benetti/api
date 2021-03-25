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
  groupIds: string[];
  machineIds: string[];
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

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  public async execute({
    userId,
    label,
    groupIds,
    machineIds,
    operatorId,
  }: Request): Promise<Route> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.MANAGER && user.role !== Role.OWNER)
      throw AppError.authorizationError;

    if (user.role === Role.MANAGER) {
      if (!user.permissions?.createRoutes) throw AppError.authorizationError;
      if (!user.groupIds) throw AppError.unknownError;

      if (user.groupIds.some(groupId => !groupIds.includes(groupId)))
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

    const checkRouteExists = await this.routesRepository.findOne({
      label,
    });

    if (checkRouteExists) throw AppError.labelAlreadyInUsed;

    if (operatorId) {
      const operator = await this.usersRepository.findOne({
        by: 'id',
        value: operatorId,
      });

      if (!operator) throw AppError.userNotFound;
    }

    if (machineIds) {
      const { machines } = await this.machinesRepository.find({
        id: machineIds,
      });

      if (machines.length !== machineIds.length) throw AppError.machineNotFound;

      // TODO: VERIFICAR SE A MACHINE JÁ ESTA EM UMA ROTA

      if (machines.some(machine => !groupIds.includes(machine.groupId)))
        throw AppError.authorizationError;
    }

    const ownerId = user.role === Role.OWNER ? user.id : user.ownerId;

    if (!ownerId) throw AppError.unknownError;

    const route = this.routesRepository.create({
      groupIds,
      label,
      machineIds,
      operatorId,
      ownerId,
    });

    await this.ormProvider.commit();

    return route;
  }
}
export default CreateRouteService;
