import { inject, injectable } from 'tsyringe';
import Counter from '../infra/typeorm/entities/Counter';
import ICountersRepository from '../repositories/ICoutersRepository';

@injectable()
class FindCountersService {
  constructor(
    @inject('CountersRepository')
    private countersRepository: ICountersRepository,
  ) {}

  public async execute(machineId: number): Promise<Counter[]> {
    const counters = await this.countersRepository.findCountersByMachineId(
      machineId,
    );

    return counters;
  }
}

export default FindCountersService;
