import CreateTelemetryLogDto from '../dtos/create-telemetry-log.dto';
import FindTelemetryLogsDto from '../dtos/find-telemetry-logs.dto';
import TelemetryLog from '../entities/telemetry-log';

interface TelemetryLogsRepository {
  create(data: CreateTelemetryLogDto): TelemetryLog;
  find(data: FindTelemetryLogsDto): Promise<TelemetryLog[]>;
}

export default TelemetryLogsRepository;
