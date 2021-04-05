import Box from './box';

class Machine {
  id: string;

  categoryId: string;

  categoryLabel: string;

  boxes: Box[];

  groupId: string;

  serialNumber: string;

  gameValue: number;

  operatorId: string;

  locationId: string;

  ownerId: string;

  isActive: boolean;
}

export default Machine;
