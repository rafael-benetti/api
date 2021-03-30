import Product from '@modules/users/contracts/models/product';
import { v4 } from 'uuid';
import CreateBoxDto from '../dtos/create-box.dto';
import Counter from './counter';

class Box {
  id: string;

  prizes: Product[];

  counters: Counter[];

  constructor(data?: CreateBoxDto) {
    if (data) {
      this.id = data.id ? data.id : v4();
      this.counters = data.counters;
      this.prizes = [];
    }
  }
}

export default Box;
