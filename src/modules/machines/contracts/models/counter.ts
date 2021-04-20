import { v4 } from 'uuid';
import CreateCounterDto from '../dtos/create-counter.dto';

export default class Counter {
  id: string;

  counterTypeId: string;

  hasMechanical: boolean;

  hasDigital: boolean;

  pin: string;

  constructor(data?: CreateCounterDto) {
    if (data) {
      this.id = data.id || v4();
      this.counterTypeId = data.counterTypeId;
      this.hasMechanical = data.hasMechanical;
      this.hasDigital = data.hasDigital;
      this.pin = data.pin;
    }
  }
}
