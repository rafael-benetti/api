import CreateTelemetryLogDto from '@modules/telemetry-logs/contracts/dtos/create-telemetry-log.dto';
import FindTelemetryLogsDto from '@modules/telemetry-logs/contracts/dtos/find-telemetry-logs.dto';
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
    if (date)
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
}

export default MikroTelemetryLogsRepository;
