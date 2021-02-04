import { inject, injectable } from 'tsyringe';
import MachineCategory from '../infra/typeorm/entities/MachineCategory';
import IMachineCategoriesRepository from '../repositories/IMachineCategoriesRepository';

interface IRequest {
  name: string;
  ownerId: number;
}

@injectable()
class CreateMachineCategoriesService {
  constructor(
    @inject('MachineCategoriesRepository')
    private machineCategoriesRepository: IMachineCategoriesRepository,
  ) {}

  public async execute({ name, ownerId }: IRequest): Promise<MachineCategory> {
    const machineCategory = await this.machineCategoriesRepository.create({
      name,
      ownerId,
    });

    return machineCategory;
  }
}

export default CreateMachineCategoriesService;
