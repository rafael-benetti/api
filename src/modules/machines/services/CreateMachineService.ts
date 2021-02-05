import { inject, injectable } from 'tsyringe';
import { format } from 'date-fns';
import Machine from '../infra/typeorm/entities/Machine';
import IMachinesRepository from '../repositories/IMachinesRepository';

interface IRequest {
  serialNumber: string;
  description: string;
  gameValue: number;
  companyId: number;
  sellingPointId: number;
}

@injectable()
class CreateMachineService {
  constructor(
    @inject('MachinesRepository')
    private machinesRepository: IMachinesRepository,
  ) {}

  public async execute({
    serialNumber,
    gameValue,
    description,
    companyId,
    sellingPointId,
  }: IRequest): Promise<Machine> {
    const registrationDate = format(new Date(), 'yyyy-MM-dd hh:mm:ss');

    const machine = await this.machinesRepository.create({
      description,
      gameValue,
      registrationDate,
      serialNumber,
      companyId,
      sellingPointId,
    });

    return machine;
  }
}

export default CreateMachineService;
