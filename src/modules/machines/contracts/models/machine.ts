import Product from '@modules/users/contracts/models/product';
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

  typeOfPrize?: Product;

  ownerId: string;

  isActive: boolean;

  maintenance: boolean;
}

export default Machine;
