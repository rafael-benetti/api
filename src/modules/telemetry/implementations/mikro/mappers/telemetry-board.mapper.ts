import TelemetryBoard from '@modules/telemetry/contracts/entities/telemetry-board';
import MikroTelemetryBoard from '../entities/mikro-telemetry-board';

abstract class TelemetryBoardMapper {
  static toApi(data: MikroTelemetryBoard): TelemetryBoard {
    const telemetryBoard = new TelemetryBoard();
    Object.assign(telemetryBoard, data);
    return telemetryBoard;
  }

  static toOrm(data: TelemetryBoard): MikroTelemetryBoard {
    const telemetryBoard = new MikroTelemetryBoard();
    Object.assign(telemetryBoard, data);
    return telemetryBoard;
  }
}

export default TelemetryBoardMapper;
