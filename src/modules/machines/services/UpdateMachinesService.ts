import Counter from '@modules/counters/infra/typeorm/entities/Counter';
import ICountersRepository from '@modules/counters/repositories/ICoutersRepository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import Machine from '../infra/typeorm/entities/Machine';
import IMachineCategoriesRepository from '../repositories/IMachineCategoriesRepository';
import IMachinesRepository from '../repositories/IMachinesRepository';

interface IRequest {
  id: number;
  serialNumber: string;
  description: string;
  gameValue: number;
  companyId: number;
  sellingPointId: number;
  machineCategoryId: number;
  counters: Counter[];
}

@injectable()
class UpdateMachinesService {
  constructor(
    @inject('MachinesRepository')
    private machinesRepository: IMachinesRepository,

    @inject('MachineCategoriesRepository')
    private machineCategoriesRepository: IMachineCategoriesRepository,

    @inject('CountersRepository')
    private countersRepository: ICountersRepository,
  ) {}

  public async execute({
    id,
    serialNumber,
    description,
    gameValue,
    companyId,
    sellingPointId,
    counters,
    machineCategoryId,
  }: IRequest): Promise<Machine> {
    const machine = await this.machinesRepository.findById(id);

    if (!machine) {
      throw AppError.machineNotFound;
    }

    // Atributos obrigatorios
    if (serialNumber) machine.serialNumber = serialNumber;
    if (description) machine.description = description;
    if (gameValue !== undefined) machine.gameValue = gameValue;
    if (companyId !== undefined) machine.companyId = companyId;

    if (sellingPointId !== undefined) machine.sellingPointId = sellingPointId;

    if (machineCategoryId !== undefined) {
      const machineCategory = await this.machineCategoriesRepository.findById(
        machineCategoryId,
      );

      if (!machineCategory) {
        throw AppError.machineCategoryNotFound;
      }
      machine.machineCategoryId = machineCategoryId;
      machine.machineCategory = machineCategory;
    }

    if (counters) {
      machine.counters = this.countersRepository.createCounters(counters);
    }

    await this.machinesRepository.save(machine);

    return machine;
  }
}

export default UpdateMachinesService;
