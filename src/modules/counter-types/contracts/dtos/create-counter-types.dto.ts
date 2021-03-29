import CounterType from '@modules/machines/contracts/enums/counter-type';

export default interface CreateCounterTypeDto {
  label: string;
  type: CounterType;
  ownerId: string;
}
