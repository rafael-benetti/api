import FindTelemetryLogsDto from '../dtos/find-telemetry-logs.dto';
import TelemetryLog from '../entities/telemetry-log';

interface TelemetryLogsRepository {
  find(data: FindTelemetryLogsDto): Promise<TelemetryLog[]>;
}

export default TelemetryLogsRepository;
