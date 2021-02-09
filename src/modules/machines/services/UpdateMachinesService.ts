import Counter from '@modules/counters/infra/typeorm/entities/Counter';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import Machine from '../infra/typeorm/entities/Machine';
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
  ) {}

  public async execute({
    id,
    serialNumber,
    description,
    gameValue,
    companyId,
    sellingPointId,
    counters,
  }: IRequest): Promise<Machine> {
    const machine = await this.machinesRepository.findById(id);

    if (!machine) {
      throw AppError.unknownError;
    }

    if (serialNumber) machine.serialNumber = serialNumber;
    if (description) machine.description = description;
    if (gameValue !== undefined) machine.gameValue = gameValue;
    if (companyId !== undefined) machine.companyId = companyId;
    if (sellingPointId !== undefined) machine.sellingPointId = sellingPointId;

    if (counters !== undefined && counters.length > 0) {
      machine.counters = counters;
    }

    await this.machinesRepository.save(machine);

    return machine;
  }
}

export default UpdateMachinesService;
