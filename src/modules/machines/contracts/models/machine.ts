import Box from './box';

class Machine {
  id: string;

  categoryId: string;

  categoryLabel: string;

  telemetryBoardId?: number | null;

  groupId: string;

  boxes: Box[];

  serialNumber: string;

  gameValue: number;

  operatorId: string;

  locationId: string;

  ownerId: string;

  isActive: boolean;
}

export default Machine;
