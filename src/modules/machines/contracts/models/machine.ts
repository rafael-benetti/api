import { v4 } from 'uuid';
import CreateMachineDto from '../dtos/create-machine.dto';

class Machine {
  _id: string;

  categoryId: string;

  groupId: string;

  pointOfSaleId?: string;

  ownerId: string;

  serialNumber: string;

  deleted: boolean;

  constructor(data?: CreateMachineDto) {
    if (data) {
      this._id = v4();
      this.categoryId = data.categoryId;
      this.groupId = data.groupId;
      this.pointOfSaleId = data.pointOfSaleId;
      this.ownerId = data.ownerId;
      this.serialNumber = data.serialNumber;
      this.deleted = false;
    }
  }
}

export default Machine;
