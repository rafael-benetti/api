import CreateCounterDto from '../dtos/create-counter.dto';
import CounterType from '../enums/counter-type';

class Counter {
  id: string;

  label: string;

  type: CounterType;

  hasMechanical: boolean;

  hasDigital: boolean;

  pin: string;

  constructor(data?: CreateCounterDto) {
    if (data) {
      this.label = data.label;
      this.type = data.type;
      this.hasMechanical = data.hasMechanical;
      this.hasDigital = data.hasDigital;
      this.pin = data.pin;
    }
  }
}

export default Counter;
