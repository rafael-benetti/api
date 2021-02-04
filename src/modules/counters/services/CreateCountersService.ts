import { inject, injectable } from 'tsyringe';
import Counter from '../infra/typeorm/entities/Counter';
import ICoutersRepository from '../repositories/ICoutersRepository';

interface IRequest {
  name: string;
  slot: number;
  hasDigital: number;
  hasMechanical: number;
  pin: number;
  pulseValue: number;
  machineId: number;
  typeId: number;
}

@injectable()
class CreateCountersService {
  constructor(
    @inject('CountersRepository')
    private countersRepository: ICoutersRepository,
  ) {}

  public async execute(data: IRequest[]): Promise<Counter[]> {
    const counters = await this.countersRepository.createCounters(data);

    return counters;
  }
}

export default CreateCountersService;
