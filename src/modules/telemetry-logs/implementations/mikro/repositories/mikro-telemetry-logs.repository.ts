import CreateTelemetryLogDto from '@modules/telemetry-logs/contracts/dtos/create-telemetry-log.dto';
import FindTelemetryLogsDto from '@modules/telemetry-logs/contracts/dtos/find-telemetry-logs.dto';
import GetIncomePerMachineResponseDto from '@modules/telemetry-logs/contracts/dtos/get-income-per-machine-response.dto';
import GetIncomePerMachineDto from '@modules/telemetry-logs/contracts/dtos/get-income-per-machine.dto';
import GetIncomePerPointOfSaleDto from '@modules/telemetry-logs/contracts/dtos/get-income-per-point-of-sale.dto';
import GetMachineIncomePerDay from '@modules/telemetry-logs/contracts/dtos/get-machine-income-per-day';
import GetPointOfSaleIncomePerDateDto from '@modules/telemetry-logs/contracts/dtos/get-point-of-sale-income-per-date.dto';
import GetPrizesPerMachineResponseDto from '@modules/telemetry-logs/contracts/dtos/get-prizes-per-machine-repository.dto';
import TelemetryLog from '@modules/telemetry-logs/contracts/entities/telemetry-log';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { inject, injectable } from 'tsyringe';
import MikroTelemetryLog from '../entities/mikro-telemetry-log';
import TelemetryLogMapper from '../mappers/telemetry-log-mapper';

@injectable()
class MikroTelemetryLogsRepository implements TelemetryLogsRepository {
  private repository = this.ormProvider.entityManager.getRepository(
    MikroTelemetryLog,
  );

  constructor(
    @inject('OrmProvider')
    private ormProvider: MikroOrmProvider,
  ) {}

  create(data: CreateTelemetryLogDto): TelemetryLog {
    const telemetryLog = new MikroTelemetryLog(data);
    this.repository.persist(telemetryLog);
    return TelemetryLogMapper.toApi(telemetryLog);
  }

  async findAndCount(
    data: FindTelemetryLogsDto,
  ): Promise<{ telemetryLogs: TelemetryLog[]; count: number }> {
    const query: Record<string, unknown> = {};

    const {
      groupId,
      pointOfSaleId,
      machineId,
      date,
      maintenance,
      type,
    } = data.filters;

    if (groupId) query.groupId = groupId;
    if (machineId) query.machineId = machineId;
    if (date?.startDate)
      if (!date.startDate) {
        query.date = {
          $lte: date.endDate,
        };
      } else {
        query.date = {
          $gte: date.startDate,
          $lte: date.endDate,
        };
      }
    if (maintenance !== undefined) query.maintenance = maintenance;

    if (pointOfSaleId !== undefined) query.pointOfSaleId = pointOfSaleId;

    if (type) query.type = type;

    const [telemetryLogs, count] = await this.repository.findAndCount(
      { ...query },

      {
        orderBy: { date: 'DESC' },
        limit: data.limit,
        offset: data.offset,
      },
    );

    return {
      telemetryLogs: telemetryLogs.map(telemetryLog =>
        TelemetryLogMapper.toApi(telemetryLog),
      ),
      count,
    };
  }

  async find(data: FindTelemetryLogsDto): Promise<TelemetryLog[]> {
    const query: Record<string, unknown> = {};

    const {
      groupId,
      pointOfSaleId,
      machineId,
      date,
      maintenance,
      type,
    } = data.filters;

    if (groupId) query.groupId = groupId;
    if (machineId) query.machineId = machineId;
    if (date?.startDate)
      if (!date.startDate) {
        query.date = {
          $lte: date.endDate,
        };
      } else {
        query.date = {
          $gte: date.startDate,
          $lte: date.endDate,
        };
      }
    if (maintenance !== undefined) query.maintenance = maintenance;

    if (pointOfSaleId !== undefined) query.pointOfSaleId = pointOfSaleId;

    if (type) query.type = type;

    const telemetryLogs = await this.repository.find(
      { ...query },

      {
        orderBy: { date: 'DESC' },
        limit: data.limit,
        offset: data.offset,
      },
    );

    return telemetryLogs;
  }

  async getIncomePerMachine({
    groupIds,
    startDate,
    endDate,
  }: GetIncomePerMachineDto): Promise<GetIncomePerMachineResponseDto[]> {
    const incomePerMachine = await this.repository.aggregate([
      {
        $match: {
          groupId: {
            $in: groupIds,
          },
          maintenance: false,
          date: {
            $gte: startDate,
            $lt: endDate,
          },
          type: 'IN',
        },
      },
      {
        $group: {
          _id: '$machineId',
          income: {
            $sum: '$value',
          },
          numberOfPlays: {
            $sum: '$numberOfPlays',
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          income: 1,
          count: 1,
          numberOfPlays: 1,
          type: 1,
        },
      },
    ]);

    return incomePerMachine;
  }

  async getPrizesPerMachine({
    groupIds,
    startDate,
    endDate,
  }: GetIncomePerMachineDto): Promise<GetPrizesPerMachineResponseDto[]> {
    const prizesPerMachine = await this.repository.aggregate([
      {
        $match: {
          groupId: {
            $in: groupIds,
          },
          maintenance: false,
          date: {
            $gte: startDate,
            $lt: endDate,
          },
          type: 'OUT',
        },
      },
      {
        $group: {
          _id: '$machineId',
          prizes: {
            $sum: '$value',
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          prizes: 1,
          count: 1,
          type: 1,
        },
      },
    ]);

    return prizesPerMachine;
  }

  async getIncomePerGroup({
    groupIds,
    startDate,
    endDate,
  }: GetIncomePerMachineDto): Promise<GetIncomePerMachineResponseDto[]> {
    const incomePerGroup = await this.repository.aggregate([
      {
        $match: {
          groupId: {
            $in: groupIds,
          },
          maintenance: false,
          date: {
            $gte: startDate,
            $lt: endDate,
          },
          type: 'IN',
        },
      },
      {
        $group: {
          _id: '$groupId',
          income: {
            $sum: '$value',
          },
          numberOfPlays: {
            $sum: '$numberOfPlays',
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          income: 1,
          count: 1,
          numberOfPlays: 1,
          type: 1,
        },
      },
    ]);

    return incomePerGroup;
  }

  async incomePerPointOfSale({
    groupIds,
    startDate,
    endDate,
  }: GetIncomePerPointOfSaleDto): Promise<[{ income: number; id: string }]> {
    const pointsOfSale = await this.repository.aggregate([
      {
        $match: {
          groupId: {
            $in: groupIds,
          },
          maintenance: false,
          date: {
            $gte: startDate,
            $lt: endDate,
          },
          type: 'IN',
        },
      },
      {
        $group: {
          _id: '$pointOfSaleId',
          income: {
            $sum: '$value',
          },
          numberOfPlays: {
            $sum: '$numberOfPlays',
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          income: 1,
          count: 1,
          numberOfPlays: 1,
          type: 1,
        },
      },
    ]);

    return pointsOfSale as [{ income: number; id: string }];
  }

  async getMachineIncomePerDay({
    groupIds,
    startDate,
    endDate,
    machineId,
    withHours,
  }: GetMachineIncomePerDay): Promise<
    { income: number; id: string; date: Date }[]
  > {
    const response = await this.repository.aggregate([
      {
        $match: {
          groupId: {
            $in: groupIds,
          },
          machineId,
          maintenance: false,
          pin: {
            $exists: true,
            $ne: null,
          },
          date: {
            $exists: true,
            $ne: null,
            $gte: startDate,
            $lt: endDate,
          },
          type: 'IN',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: `%Y-%m-%d${withHours ? 'T%H:00:00' : ''}`,
              date: '$date',
              timezone: '-03:00',
            },
          },

          income: {
            $sum: '$value',
          },
          numberOfPlays: {
            $sum: '$numberOfPlays',
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          income: 1,
          count: 1,
          pin: 1,
          numberOfPlays: 1,
          type: 1,
        },
      },
    ]);

    return response as { income: number; id: string; date: Date }[];
  }

  async getMachineGivenPrizesPerDay({
    groupIds,
    startDate,
    endDate,
    machineId,
    withHours,
  }: GetMachineIncomePerDay): Promise<
    { givenPrizes: number; id: { date: string; pin: number }; date: Date }[]
  > {
    const response = await this.repository.aggregate([
      {
        $match: {
          groupId: {
            $in: groupIds,
          },
          machineId,
          maintenance: false,
          pin: {
            $exists: true,
            $ne: null,
          },
          date: {
            $exists: true,
            $ne: null,
            $gte: startDate,
            $lt: endDate,
          },
          type: 'OUT',
        },
      },
      {
        $group: {
          _id: {
            pin: '$pin',
            date: {
              $dateToString: {
                format: `%Y-%m-%d${withHours ? 'T%H:00:00' : ''}`,
                date: '$date',
                timezone: '-03:00',
              },
            },
          },
          givenPrizes: {
            $sum: '$value',
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          date: 1,
          count: 1,
          pin: 1,
          type: 1,
          givenPrizes: 1,
        },
      },
    ]);

    return response as {
      id: { date: string; pin: number };
      givenPrizes: number;
      date: Date;
    }[];
  }

  async getPointOfSaleIncomePerDate({
    startDate,
    endDate,
    pointOfSaleId,
    withHours,
  }: GetPointOfSaleIncomePerDateDto): Promise<
    {
      total: number;
      id: { date: string; type: 'IN' | 'OUT'; machineId: string };
    }[]
  > {
    const response = await this.repository.aggregate([
      {
        $match: {
          pointOfSaleId,
          maintenance: false,
          date: {
            $exists: true,
            $ne: null,
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: `%Y-%m-%d${withHours ? 'T%H:00:00' : ''}`,
              date: '$date',
              timezone: '-03:00',
            },
            type: '$type',
            machineId: '$machineId',
          },
          total: {
            $sum: '$value',
          },
          numberOfPlays: {
            $sum: '$numberOfPlays',
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          total: 1,
          count: 1,
          numberOfPlays: 1,
          type: 1,
        },
      },
    ]);

    return response as {
      total: number;
      id: { date: string; type: 'IN' | 'OUT'; machineId: string };
    }[];
  }

  save(data: TelemetryLog): void {
    const telemetryLog = TelemetryLogMapper.toOrm(data);
    this.repository.persist(telemetryLog);
  }
}

export default MikroTelemetryLogsRepository;
