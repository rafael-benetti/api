import CreateTelemetryBoardDto from '../dtos/create-telemetry-board.dto';

class TelemetryBoard {
  id: number;

  ownerId: string;

  groupId: string;

  machineId?: string;

  lastConnection?: Date;

  connectionStrength?: string;

  connectionType?: string;

  constructor(data?: CreateTelemetryBoardDto) {
    if (data) {
      this.ownerId = data.ownerId;
      this.groupId = data.groupId;
    }
  }
}

export default TelemetryBoard;
