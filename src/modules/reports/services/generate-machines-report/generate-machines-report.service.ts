import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/app-error';
import Group from '@modules/groups/contracts/models/group';
import Role from '@modules/users/contracts/enums/role';
import MachineLogsRepository from '@modules/machine-logs/contracts/repositories/machine-logs.repository';
import MachineLogType from '@modules/machine-logs/contracts/enums/machine-log-type';
import { differenceInDays, endOfDay, startOfDay } from 'date-fns';
import ExcelJS from 'exceljs';
import exportMachinesReport from './export-machines-report';

interface Request {
  userId: string;
  groupId: string;
  startDate: Date;
  endDate: Date;
  download: boolean;
  machineIds: string[];
}

interface Response {
  groupLabel: string;
  serialNumber: string;
  location: string | undefined;
  category: string;
  income: number | undefined;
  prizes: number | undefined;
  remoteCreditAmount: number | undefined;
  numberOfPlays: number | undefined;
  gameValue: number;
  playsPerPrize: number;
  incomePerPrizeGoal?: number;
  incomePerMonthGoal?: number;
  averagePerDay: number;
}

@injectable()
class GenerateMachinesReportService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachineLogsRepository')
    private machineLogsRepository: MachineLogsRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,
  ) {}

  async execute({
    userId,
    groupId,
    startDate,
    endDate,
    download,
    machineIds,
  }: Request): Promise<
    | {
        date: {
          startDate: Date;
          endDate: Date;
        };
        machineAnalytics: Response[];
      }
    | ExcelJS.Workbook
  > {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.MANAGER && user.role !== Role.OWNER)
      throw AppError.authorizationError;

    if (user.role !== Role.OWNER && !user.permissions?.generateReports)
      throw AppError.authorizationError;

    let groupIds: string[] = [];
    let groups: Group[] = [];

    if (groupId && !machineIds) {
      const group = await this.groupsRepository.findOne({
        by: 'id',
        value: groupId,
      });

      if (!group) throw AppError.groupNotFound;

      if (user.role === Role.OWNER && group.ownerId !== user.id)
        throw AppError.authorizationError;

      if (user.role === Role.MANAGER && !user.groupIds?.includes(group.id))
        throw AppError.authorizationError;
      groups = [group];
      groupIds.push(groupId);
    } else if (user.role === Role.MANAGER && !machineIds) {
      if (!user.groupIds) throw AppError.unknownError;
      groupIds = user.groupIds;
      groups = await this.groupsRepository.find({
        filters: {
          ids: user.groupIds,
        },
      });
    } else if (user.role === Role.OWNER && !machineIds) {
      groups = await this.groupsRepository.find({
        filters: {
          ownerId: user.id,
        },
        fields: ['id', 'label'],
      });

      groupIds = groups.map(group => group.id);
    }

    let machines;

    if (machineIds) {
      machines = await this.machinesRepository.find({
        id: machineIds,
        isActive: true,
        populate: ['pointOfSale'],
        fields: [
          'id',
          'serialNumber',
          'categoryLabel',
          'gameValue',
          'locationId',
          'incomePerPrizeGoal',
          'incomePerMonthGoal',
          'pointOfSale',
          'pointOfSale.id',
          'pointOfSale.label',
          'groupId',
          'ownerId',
        ],
      });

      if (user.role === Role.OWNER)
        if (machines.some(machine => machine.ownerId !== user.id))
          throw AppError.authorizationError;

      if (user.role === Role.MANAGER)
        if (machines.some(machine => !user.groupIds?.includes(machine.groupId)))
          throw AppError.authorizationError;
      groupIds = machines.map(machine => machine.groupId);
    } else {
      machines = await this.machinesRepository.find({
        groupIds,
        isActive: true,
        populate: ['pointOfSale'],
        fields: [
          'id',
          'serialNumber',
          'categoryLabel',
          'gameValue',
          'locationId',
          'incomePerPrizeGoal',
          'incomePerMonthGoal',
          'pointOfSale',
          'pointOfSale.id',
          'pointOfSale.label',
          'groupId',
        ],
      });
    }

    startDate = startOfDay(startDate);
    endDate = endOfDay(endDate);

    const incomePerMachine =
      await this.telemetryLogsRepository.getIncomePerMachine({
        groupIds,
        endDate,
        startDate,
      });

    const prizesPerMachine =
      await this.telemetryLogsRepository.getPrizesPerMachine({
        endDate,
        groupIds,
        startDate,
      });

    const machineLogs = await this.machineLogsRepository.find({
      groupId: groupIds,
      machineId: machines.map(machine => machine.id),
      endDate,
      startDate,
      type: MachineLogType.REMOTE_CREDIT,
    });

    const numberOfDays =
      differenceInDays(endDate, startDate) !== 0
        ? differenceInDays(endDate, startDate)
        : 1;

    const machineAnalytics = machines.map(machine => {
      const remoteCreditAmount = machineLogs
        .filter(machineLog => machineLog.machineId === machine.id)
        .reduce((a, b) => a + b.quantity, 0);

      const numberOfPlays = Math.floor(
        (incomePerMachine.find(machineIncome => machineIncome.id === machine.id)
          ?.income || 0) / machine.gameValue,
      );

      const prizes = prizesPerMachine.find(
        prizes => prizes.id === machine.id,
      )?.prizes;

      const income = incomePerMachine.find(
        machineIncome => machineIncome.id === machine.id,
      )?.income;

      const groupLabel =
        groups.find(group => group.id === machine.groupId)?.label ||
        'Parceria Pessoal';

      return {
        groupLabel,
        serialNumber: machine.serialNumber,
        location: machine.pointOfSale?.label || '',
        category: machine.categoryLabel,
        income: income || 0,
        prizes: prizes || 0,
        remoteCreditAmount: remoteCreditAmount || 0,
        numberOfPlays: numberOfPlays || 0,
        gameValue: machine.gameValue,
        playsPerPrize:
          numberOfPlays && prizes
            ? Number((numberOfPlays / prizes).toFixed(2))
            : 0,
        incomePerPrizeGoal: machine.incomePerPrizeGoal || 0,
        incomePerMonthGoal: machine.incomePerMonthGoal || 0,
        averagePerDay:
          Number((income ? income / numberOfDays : 0).toFixed(2)) || 0,
      };
    });

    if (download) {
      const Workbook = await exportMachinesReport({
        date: {
          startDate,
          endDate,
        },
        machineAnalytics,
      });

      return Workbook;
    }

    return {
      date: {
        startDate,
        endDate,
      },
      machineAnalytics,
    };
  }
}

export default GenerateMachinesReportService;
