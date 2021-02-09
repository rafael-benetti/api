import { inject, injectable } from 'tsyringe';
import { format } from 'date-fns';
import Counter from '@modules/counters/infra/typeorm/entities/Counter';
import ICountersRepository from '@modules/counters/repositories/ICoutersRepository';
import Machine from '../infra/typeorm/entities/Machine';
import IMachinesRepository from '../repositories/IMachinesRepository';

interface IRequest {
  serialNumber: string;
  description: string;
  gameValue: number;
  companyId: number;
  sellingPointId?: number;
  machineCategoryId?: number;
  counters?: Counter[];
}

@injectable()
class CreateMachineService {
  constructor(
    @inject('MachinesRepository')
    private machinesRepository: IMachinesRepository,

    @inject('CountersRepository')
    private countersRepository: ICountersRepository,
  ) {}

  public async execute({
    serialNumber,
    gameValue,
    description,
    companyId,
    sellingPointId,
    machineCategoryId,
    counters,
  }: IRequest): Promise<Machine> {
    const registrationDate = format(new Date(), 'yyyy-MM-dd hh:mm:ss');

    let countersEntities: Counter[] = [];

    if (counters) {
      countersEntities = await this.countersRepository.createCounters(counters);
    }

    const machine = await this.machinesRepository.create({
      description,
      gameValue,
      registrationDate,
      serialNumber,
      companyId,
      sellingPointId,
      machineCategoryId,
      counters: countersEntities,
    });

    return machine;
  }
}

export default CreateMachineService;
