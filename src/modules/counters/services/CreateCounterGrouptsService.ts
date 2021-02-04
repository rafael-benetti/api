import { inject, injectable } from 'tsyringe';
import CounterGroup from '../infra/typeorm/entities/CounterGroups';
import ICounterGroupsRepository from '../repositories/ICounterGroupsRepository';

interface IRequest {
  name: string;
  machineId: number;
}

@injectable()
class CreateCounterGroupsService {
  constructor(
    @inject('CounterGroupsRepository')
    private counterGroupsRepository: ICounterGroupsRepository,
  ) {}

  public async execute({ name, machineId }: IRequest): Promise<CounterGroup> {
    const counterGroup = await this.counterGroupsRepository.create({
      name,
      machineId,
    });

    return counterGroup;
  }
}

export default CreateCounterGroupsService;
