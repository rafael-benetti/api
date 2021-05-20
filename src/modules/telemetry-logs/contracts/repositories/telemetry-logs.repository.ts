import CreateTelemetryLogDto from '../dtos/create-telemetry-log.dto';
import FindTelemetryLogsDto from '../dtos/find-telemetry-logs.dto';
import GetIncomePerMachineDto from '../dtos/get-income-per-machine.dto';
import TelemetryLog from '../entities/telemetry-log';

interface TelemetryLogsRepository {
  create(data: CreateTelemetryLogDto): TelemetryLog;
  find(data: FindTelemetryLogsDto): Promise<TelemetryLog[]>;
  getIncomePerMachine(
    data: GetIncomePerMachineDto,
  ): Promise<{ _id: string; income: number; count: number }[]>;
}

export default TelemetryLogsRepository;
