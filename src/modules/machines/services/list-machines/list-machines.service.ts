import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import FindMachinesDto from '@modules/machines/contracts/dtos/find-machines.dto';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import { Promise } from 'bluebird';

interface Request {
  lean: boolean;
  userId: string;
  operatorId?: string;
  categoryId: string;
  groupId: string;
  routeId: string;
  pointOfSaleId: string;
  serialNumber: string;
  isActive: boolean;
  telemetryStatus?: 'ONLINE' | 'OFFLINE' | 'VIRGIN' | 'NO_TELEMETRY';
  offset: number;
  limit: number;
}

interface Result {
  machines: Machine[];
  count: number;
}

@injectable()
class ListMachinesService {
  constructor(
    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('RoutesRepository')
    private routesRepository: RoutesRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,
  ) {}

  public async execute({
    lean,
    userId,
    categoryId,
    groupId,
    routeId,
    pointOfSaleId,
    serialNumber,
    telemetryStatus,
    isActive,
    operatorId,
    limit,
    offset,
  }: Request): Promise<
    | Result
    | { id: string; serialNumber: string; locationId: string | undefined }[]
  > {
    const filters: FindMachinesDto = {};

    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.OWNER) filters.ownerId = user.id;

    if (user.role === Role.MANAGER) filters.groupIds = user.groupIds;

    if (user.role === Role.OPERATOR) filters.operatorId = user.id;

    if (telemetryStatus) filters.telemetryStatus = telemetryStatus;

    if (lean) {
      filters.isActive = true;
      filters.fields = ['id', 'serialNumber', 'locationId'];
      const leanMachines = await this.machinesRepository.findAndCount(filters);

      return leanMachines;
    }

    if (routeId) {
      filters.routeId = routeId;
      const route = await this.routesRepository.findOne({
        id: routeId,
      });

      if (!route) {
        return {
          machines: [],
          count: 0,
        };
      }

      filters.pointOfSaleId = route.pointsOfSaleIds;
    }

    if (groupId) {
      if (!user.groupIds?.includes(groupId) && user.role !== Role.OWNER)
        throw AppError.authorizationError;

      const group = await this.groupsRepository.findOne({
        by: 'id',
        value: groupId,
      });

      if (!group) throw AppError.groupNotFound;

      if (user.role === Role.OWNER && user.id !== group.ownerId)
        throw AppError.authorizationError;

      filters.groupIds = [groupId];
    }

    if (pointOfSaleId && !routeId) filters.pointOfSaleId = pointOfSaleId;
    filters.categoryId = categoryId;
    filters.serialNumber = serialNumber;
    filters.limit = limit;
    filters.offset = offset;
    filters.isActive = isActive;
    if (user.role !== Role.OPERATOR) filters.operatorId = operatorId;
    filters.populate = ['operator'];

    const result = await this.machinesRepository.findAndCount(filters);

    const machinesPromise = result.machines.map(async machine => {
      const [
        givenPrizes,
      ] = await this.telemetryLogsRepository.getPrizesPerMachine({
        endDate: new Date(),
        startDate: machine.lastCollection,
        groupIds: [machine.groupId],
        machineId: machine.id,
      });

      if (givenPrizes) {
        machine.givenPrizes = givenPrizes.prizes;
      } else {
        machine.givenPrizes = 0;
      }

      machine.operator = {
        name: machine.operator?.name,
      };

      return machine;
    });

    const machines = await Promise.all(machinesPromise);

    result.machines = machines;

    return result;
  }
}
export default ListMachinesService;
