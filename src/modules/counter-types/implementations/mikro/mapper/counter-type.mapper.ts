import CounterType from '@modules/counter-types/contracts/models/counter-type';
import MikroCounterType from '../models/mikro-counter-type';

abstract class CounterTypeMapper {
  static toEntity(data: MikroCounterType): CounterType {
    const counterType = new CounterType();
    Object.assign(counterType, data);
    return counterType;
  }

  static toMikroEntity(data: CounterType): MikroCounterType {
    const counterType = new MikroCounterType();
    Object.assign(counterType, data);
    return counterType;
  }
}

export default CounterTypeMapper;
