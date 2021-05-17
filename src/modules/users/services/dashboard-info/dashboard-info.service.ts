import logger from '@config/logger';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { subMonths } from 'date-fns';
import { Promise } from 'bluebird';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
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
}

@injectable()
export default class DashboardInfoService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,
  ) {}

  async execute({ userId }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const isOperator = user.role === Role.OPERATOR;

    let groupIds: string[] = [];

    if (user.role === Role.OWNER)
      groupIds = (
        await this.groupsRepository.find({
          filters: {
            ownerId: user.ownerId,
          },
        })
      ).map(group => group.id);

    const machinesSortedByLastCollection = (
      await this.machinesRepository.find({
        orderByLastCollection: true,
        operatorId: isOperator ? user.id : undefined,
        groupIds,
        limit: 5,
        offset: 0,
      })
    ).machines;

    const machinesSortedByLastConnection = (
      await this.machinesRepository.find({
        orderByLastConnection: true,
        groupIds,
        limit: 5,
        offset: 0,
      })
    ).machines;

    const machinesSortedByStock = await this.machinesRepository.machineSortedByStock(
      {
        groupIds,
      },
    );

    const offlineMachines = await this.machinesRepository.count({
      groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'OFFLINE',
    });

    const onlineMachines = await this.machinesRepository.count({
      groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'ONLINE',
    });

    const machinesNeverConnected = await this.machinesRepository.count({
      groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'VIRGIN',
    });

    const machinesWithoutTelemetryBoard = await this.machinesRepository.count({
      groupIds,
      operatorId: isOperator ? user.id : undefined,
      telemetryStatus: 'NO_TELEMETRY',
    });

    const endDate = new Date(Date.now());
    const startDate = subMonths(endDate, 1);
    // if (period === Period.DAILY) startDate = subDays(endDate, 1);
    // if (period === Period.WEEKLY) startDate = subWeeks(endDate, 1);
    // if (period === Period.MONTHLY) startDate = subMonths(endDate, 1);

    const telemetryLogsInPromise = async () => {
      const response = await this.telemetryLogsRepository.find({
        filters: {
          date: {
            startDate,
            endDate,
          },
          groupId: groupIds,
          maintenance: false,
          type: 'IN',
        },
      });

      return response;
    };

    const telemetryLogsOutPromise = async () => {
      const response = await this.telemetryLogsRepository.find({
        filters: {
          date: {
            startDate,
            endDate,
          },
          groupId: groupIds,
          maintenance: false,
          type: 'OUT',
        },
      });

      return response;
    };

    const [telemetryLogsIn, telemetryLogsOut] = await Promise.all([
      telemetryLogsInPromise(),
      telemetryLogsOutPromise(),
    ]);

    return {
      machinesSortedByLastCollection,
      machinesSortedByLastConnection,
      offlineMachines,
      onlineMachines,
      machinesNeverConnected,
      machinesWithoutTelemetryBoard,
      machinesSortedByStock,
    };
  }
}
