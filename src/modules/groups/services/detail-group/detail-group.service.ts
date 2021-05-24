import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Period from '@modules/machines/contracts/dtos/period.dto';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import TypeUsersRepository from 'migration-script/modules/users/typeorm/repostories/type-users-repository';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  groupId: string;
  startDate: Date;
  endDate: Date;
  period: Period;
}

interface Response {
  machinesSortedByLastCollection: Machine[];
  machinesSortedByLastConnection: Machine[];
  machinesSortedByStock: {
    id: string;
    serialNumber: string;
    total: number;
    minimumPrizeCount: number;
  }[];
  machinesNeverConnected: number;
  machinesWithoutTelemetryBoard: number;
  offlineMachines: number;
  onlineMachines: number;
  chartData1?: ChartData1[];
  chartData2?: ChartData2;
  givenPrizesCount?: number;
  income?: number;
}

@injectable()
export default class DetailGroupService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,
  ) {}

  async execute({
    userId,
    startDate,
    endDate,
    groupId,
  }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role === Role.OWNER) {
      const groupIds = (
        await this.groupsRepository.find({
          filters: {
            ownerId: user.id,
          },
        })
      ).map(group => group.id);
    }

    const machinesSortedByLastCollection = (
      await this.machinesRepository.find({
        orderByLastCollection: true,
        groupIds: groupId,
        limit: 5,
        offset: 0,
        fields: [
          'id',
          'serialNumber',
          'lastCollection',
          'lastConnection',
          'pointOfSaleId',
          'pointOfSale',
        ],
        populate: ['pointOfSale'],
      })
    ).machines;

    const machinesSortedByLastConnection = (
      await this.machinesRepository.find({
        orderByLastConnection: true,
        operatorId: isOperator ? user.id : undefined,
        groupIds: isOperator ? undefined : groupIds,
        limit: 5,
        offset: 0,
        fields: [
          'id',
          'serialNumber',
          'lastConnection',
          'lastCollection',
          'pointOfSaleId',
          'pointOfSale',
        ],
        populate: ['pointOfSale'],
      })
    ).machines;

    const machinesSortedByStock = await this.machinesRepository.machineSortedByStock(
      {
        groupIds: isOperator ? undefined : groupIds,
        operatorId: isOperator ? user.id : undefined,
      },
    );

    const offlineMachines = await this.machinesRepository.count({
      groupIds: isOperator ? undefined : groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'OFFLINE',
    });

    const onlineMachines = await this.machinesRepository.count({
      groupIds: isOperator ? undefined : groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'ONLINE',
    });

    const machinesNeverConnected = await this.machinesRepository.count({
      groupIds: isOperator ? undefined : groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'VIRGIN',
    });

    const machinesWithoutTelemetryBoard = await this.machinesRepository.count({
      groupIds: isOperator ? undefined : groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'NO_TELEMETRY',
    });

    if (period) {
      endDate = new Date(Date.now());
      if (period === Period.DAILY) startDate = subDays(endDate, 1);
      if (period === Period.WEEKLY) startDate = subWeeks(endDate, 1);
      if (period === Period.MONTHLY) startDate = subMonths(endDate, 1);
    }

    if (!startDate) throw AppError.unknownError;
    if (!endDate) throw AppError.unknownError;
  }
}
