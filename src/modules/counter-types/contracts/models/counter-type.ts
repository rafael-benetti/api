import Type from '@modules/machines/contracts/enums/counter-type';

class CounterType {
  id: string;

  label: string;

  type: Type;

  ownerId: string;
}

export default CounterType;
