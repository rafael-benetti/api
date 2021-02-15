import ICreateCounterDTO from '@modules/counters/dtos/ICreateCounterDTO';
import ICountersRepository from '@modules/counters/repositories/ICoutersRepository';
import { getRepository, Repository } from 'typeorm';
import Counter from '../entities/Counter';

class CountersRepository implements ICountersRepository {
  private ormRepository: Repository<Counter>;

  constructor() {
    this.ormRepository = getRepository(Counter);
  }

  public createCounters(data: ICreateCounterDTO[]): Counter[] {
    const counters = data.map(counter => this.ormRepository.create(counter));

    return counters;
  }

  public async findCountersByMachineId(machineId: number): Promise<Counter[]> {
    const counters = await this.ormRepository.find({ where: { machineId } });

    return counters;
  }

  public async save(counter: Counter): Promise<Counter> {
    await this.ormRepository.save(counter);

    return counter;
  }
}

export default CountersRepository;
