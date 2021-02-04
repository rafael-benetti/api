import ICreateCountersDTO from '../dtos/ICreateCountersDTO';
import Counter from '../infra/typeorm/entities/Counter';

export default interface ICountersRepository {
  createCounters(data: ICreateCountersDTO[]): Promise<Counter[]>;
  findCountersByMachineId(machineId: number): Promise<Counter[]>;
}
