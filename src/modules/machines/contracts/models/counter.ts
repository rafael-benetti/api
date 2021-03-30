import CreateCounterDto from '../dtos/create-counter.dto';

class Counter {
  id: string;

  counterTypeId: string;

  hasMechanical: boolean;

  hasDigital: boolean;

  pin: string;

  constructor(data?: CreateCounterDto) {
    if (data) {
      this.counterTypeId = data.counterTypeId;
      this.hasMechanical = data.hasMechanical;
      this.hasDigital = data.hasDigital;
      this.pin = data.pin;
    }
  }
}

export default Counter;
