import Box from './box';

class Machine {
  id: string;

  categoryId?: string;

  categoryLabel: string;

  telemetryBoardId?: number;

  groupId: string;

  boxes: Box[];

  serialNumber: string;

  gameValue: number;

  operatorId?: string;

  locationId?: string;

  typeOfPrize?: { id: string; label: string };

  minimumPrizeCount?: number;

  ownerId: string;

  isActive: boolean;

  maintenance: boolean;

  lastConnection?: Date;
}

export default Machine;
