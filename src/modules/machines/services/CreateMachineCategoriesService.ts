import { inject, injectable } from 'tsyringe';
import MachineCategory from '../infra/typeorm/entities/MachineCategory';
import IMachineCategoriesRepository from '../repositories/IMachineCategoriesRepository';

interface IRequest {
  name: string;
  userId: number;
}

@injectable()
class CreateMachineCategoriesService {
  constructor(
    @inject('MachineCategoriesRepository')
    private machineCategoriesRepository: IMachineCategoriesRepository,
  ) {}

  public async execute({ name, userId }: IRequest): Promise<MachineCategory> {
    const machineCategory = await this.machineCategoriesRepository.create({
      name,
      ownerId: userId,
    });

    return machineCategory;
  }
}

export default CreateMachineCategoriesService;
