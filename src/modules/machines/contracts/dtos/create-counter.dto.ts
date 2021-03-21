import CounterType from '../enums/counter-type';

export default interface CreateCounterDto {
  label: string;

  type: CounterType;

  hasMechanical: boolean;

  hasDigital: boolean;

  pin: string;
}
