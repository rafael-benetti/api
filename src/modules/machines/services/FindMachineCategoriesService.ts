import { inject, injectable } from 'tsyringe';
import MachineCategory from '../infra/typeorm/entities/MachineCategory';
import IMachineCategoriesRepository from '../repositories/IMachineCategoriesRepository';

@injectable()
class FindMachineCategoriesService {
  constructor(
    @inject('MachineCategoriesRepository')
    private machineCategoriesRepository: IMachineCategoriesRepository,
  ) {}

  public async execute(userId: number): Promise<MachineCategory[]> {
    const machineCategories = await this.machineCategoriesRepository.listAllCategories(
      userId,
    );

    return machineCategories;
  }
}

export default FindMachineCategoriesService;
