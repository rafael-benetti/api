import { v4 } from 'uuid';
import CreateBoxDto from '../dtos/create-box.dto';
import Counter from './counter';

class Box {
  id: string;

  prizes: Prize[];

  counters: Counter[];

  constructor(data?: CreateBoxDto) {
    if (data) {
      this.id = data.id ? data.id : v4();
      this.counters = data.counters;
      this.prizes = data.prizes;
    }
  }
}

export default Box;
