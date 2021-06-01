import CreateCounterTypeDto from '../dtos/create-counter-types.dto';
import FindCounterTypesDto from '../dtos/find-counter-types.dto';
import CounterType from '../models/counter-type';

export default interface CounterTypesRepository {
  create(data: CreateCounterTypeDto): CounterType;
  findOne(data: FindCounterTypesDto): Promise<CounterType | undefined>;
  find(data: FindCounterTypesDto): Promise<CounterType[]>;
  save(data: CounterType): void;
}
