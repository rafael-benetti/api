import { v4 } from 'uuid';
import CreateTelemetryBoardDto from '../dtos/create-telemetry-board.dto';

class TelemetryBoard {
  id: string;

  ownerId: string;

  machineId?: string;

  lastConnection?: Date;

  connectionSignal?: string;

  connectionType?: string;

  constructor(data?: CreateTelemetryBoardDto) {
    if (data) {
      this.id = v4();
      this.ownerId = data.ownerId;
    }
  }
}

export default TelemetryBoard;
