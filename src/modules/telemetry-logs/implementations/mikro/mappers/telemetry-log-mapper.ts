import TelemetryLog from '@modules/telemetry-logs/contracts/entities/telemetry-log';
import MikroTelemetryLog from '../entities/mikro-telemetry-log';

abstract class TelemetryLogMapper {
  static toApi(data: MikroTelemetryLog): TelemetryLog {
    const telemetryLog = new TelemetryLog();
    Object.assign(telemetryLog, data);
    return telemetryLog;
  }

  static toOrm(data: TelemetryLog): MikroTelemetryLog {
    const telemetryLog = new MikroTelemetryLog();
    Object.assign(telemetryLog, data);
    return telemetryLog;
  }
}

export default TelemetryLogMapper;
