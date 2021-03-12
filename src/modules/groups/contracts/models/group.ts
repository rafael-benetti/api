import { v4 } from 'uuid';
import CreateGroupDto from '../dtos/create-group.dto';
import GroupStock from './group-stock';

class Group {
  id: string;

  label?: string;

  isPersonal: boolean;

  stock: GroupStock;

  ownerId: string;

  constructor(data?: CreateGroupDto) {
    if (data) {
      this.id = v4();
      this.label = data.label;
      this.isPersonal = data.isPersonal;
      this.stock = {
        prizes: [],
        supplies: [],
      };
      this.ownerId = data.ownerId;
    }
  }
}

export default Group;
