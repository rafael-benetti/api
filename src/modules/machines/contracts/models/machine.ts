import Box from './box';

class Machine {
  id: string;

  categoryId: string;

  categoryLabel: string;

  boxes: Box[];

  // telemetryId: string; //TODO

  groupId: string;

  serialNumber: string;

  gameValue: number;

  operatorId: string;

  locationId: string;

  ownerId: string;
}

export default Machine;
