import Group from '@modules/groups/contracts/models/group';
import User from '@modules/users/contracts/models/user';
import CreateTelemetryBoardDto from '../dtos/create-telemetry-board.dto';

class TelemetryBoard {
  id: number;

  groupId: string;

  group?: Group;

  integratedCircuitCardId?: string;

  machineId?: string;

  lastConnection?: Date;

  connectionStrength?: string;

  connectionType?: string;

  owner?: User;

  ownerId: string;

  constructor(data?: CreateTelemetryBoardDto) {
    if (data) {
      this.ownerId = data.ownerId;
      this.groupId = data.groupId;
      this.integratedCircuitCardId = data.integratedCircuitCardId;
      this.connectionStrength = data.connectionStrength;
      this.connectionType = data.connectionType;
      this.lastConnection = data.lastConnection;
      this.machineId = data.machineId;
    }
  }
}

export default TelemetryBoard;
