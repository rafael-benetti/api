import { v4 } from 'uuid';
import CreateTelemetryBoardDto from '../dtos/create-telemetry-board.dto';

class TelemetryBoard {
  id: string;

  ownerId: string;

  groupId: string;

  label: string;

  machineId?: string;

  lastConnection?: Date;

  connectionSignal?: string;

  connectionType?: string;

  constructor(data?: CreateTelemetryBoardDto) {
    if (data) {
      this.id = v4();
      this.ownerId = data.ownerId;
      this.groupId = data.groupId;
      this.label = data.label;
    }
  }
}

export default TelemetryBoard;
