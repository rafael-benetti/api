import ICreateCounterDTO from '../dtos/ICreateCounterDTO';
import Counter from '../infra/typeorm/entities/Counter';

export default interface ICountersRepository {
  createCounters(data: ICreateCounterDTO[]): Counter[];
  findCountersByMachineId(machineId: number): Promise<Counter[]>;
  save(counter: Counter): Promise<Counter>;
}
