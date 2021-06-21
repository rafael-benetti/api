import { v4 } from 'uuid';
import CreateBoxDto from '../dtos/create-box.dto';
import Counter from './counter';

class Box {
  id: string;

  numberOfPrizes: number;

  currentMoney: number;

  counters: Counter[];

  constructor(data?: CreateBoxDto) {
    if (data) {
      this.id = data.id || v4();
      this.numberOfPrizes = data.numberOfPrizes || 0;
      this.currentMoney = data.currentMoney ? data.currentMoney : 0;
      this.counters = data.counters;
    }
  }
}

export default Box;
