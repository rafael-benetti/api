import Product from '@modules/products/contracts/models/product';
import { v4 } from 'uuid';
import CreateGroupDto from '../dtos/create-group-dto';

class Group {
  _id: string;

  label?: string;

  isPersonal: boolean;

  stock: Product[];

  ownerId: string;

  constructor(data?: CreateGroupDto) {
    if (data) {
      this._id = v4();
      this.label = data.label;
      this.isPersonal = data.isPersonal !== undefined ? data.isPersonal : false;
      this.stock = [];
      this.ownerId = data.ownerId;
    }
  }
}

export default Group;
