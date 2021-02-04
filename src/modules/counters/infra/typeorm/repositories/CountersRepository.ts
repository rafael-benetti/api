import ICreateCountersDTO from '@modules/counters/dtos/ICreateCountersDTO';
import ICountersRepository from '@modules/counters/repositories/ICoutersRepository';
import { getRepository, Repository } from 'typeorm';
import Counter from '../entities/Counter';

class CountersRepository implements ICountersRepository {
  private ormRepository: Repository<Counter>;

  constructor() {
    this.ormRepository = getRepository(Counter);
  }

  public async findCountersByMachineId(machineId: number): Promise<Counter[]> {
    const counters = await this.ormRepository.find({ where: { machineId } });

    return counters;
  }

  public async createCounters(data: ICreateCountersDTO[]): Promise<Counter[]> {
    const counters = data.map(counter => this.ormRepository.create(counter));

    await this.ormRepository.save(counters);

    return counters;
  }
}

export default CountersRepository;
