import Box from '../models/box';

export default interface CreateMachineDto {
  categoryId: string;

  boxes: Box[];

  // telemetryId: string; //TODO

  groupId: string;

  serialNumber: string;

  categoryLabel: string;

  gameValue: number;

  operatorId: string;

  locationId: string;

  ownerId: string;
}
