import FindTelemetryLogsDto from '@modules/telemetry-logs/contracts/dtos/find-telemetry-logs.dto';
import TelemetryLog from '@modules/telemetry-logs/contracts/entities/telemetry-log';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { inject, injectable } from 'tsyringe';
import MikroTelemetryLog from '../entities/mikro-telemetry-log';

@injectable()
class MikroTelemetryLogsRepository implements TelemetryLogsRepository {
  private repository = this.ormProvider.entityManager.getRepository(
    MikroTelemetryLog,
  );

  constructor(
    @inject('OrmProvider')
    private ormProvider: MikroOrmProvider,
  ) {}

  async find(data: FindTelemetryLogsDto): Promise<TelemetryLog[]> {
    const query: Record<string, unknown> = {};

    const { limit, offset } = data;
    const { machineId, startDate, endDate } = data.filters;

    if (machineId) query.machineId = machineId;
    if (startDate)
      query.date = {
        $and: [{ $gte: startDate }, { $lte: endDate }],
      };

    const telemetryLogs = await this.repository.find(
      { ...query },
      {
        limit,
        offset,
      },
    );

    return telemetryLogs;
  }
}

export default MikroTelemetryLogsRepository;
