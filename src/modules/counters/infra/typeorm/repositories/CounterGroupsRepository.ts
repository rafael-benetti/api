import ICreateCounterGroupsDTO from '@modules/counters/dtos/ICreateCounterGroupsDTO';
import ICounterGroupsRepository from '@modules/counters/repositories/ICounterGroupsRepository';
import { getRepository, Repository } from 'typeorm';
import CounterGroup from '../entities/CounterGroups';

class CounterGroupsRepository implements ICounterGroupsRepository {
  private ormRepository: Repository<CounterGroup>;

  constructor() {
    this.ormRepository = getRepository(CounterGroup);
  }

  public async create({
    name,
    machineId,
  }: ICreateCounterGroupsDTO): Promise<CounterGroup> {
    const counterGroup = this.ormRepository.create({ name, machineId });

    await this.ormRepository.save(counterGroup);

    return counterGroup;
  }
}

export default CounterGroupsRepository;
