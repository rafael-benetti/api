import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import MachineCategory from '../infra/typeorm/entities/MachineCategory';
import IMachineCategoriesRepository from '../repositories/IMachineCategoriesRepository';

@injectable()
class ShowMachineCategoryService {
  constructor(
    @inject('MachineCategoriesRepository')
    private machineCategoriesRepository: IMachineCategoriesRepository,
  ) {}

  public async execute(id: number): Promise<MachineCategory | undefined> {
    const machineCategory = await this.machineCategoriesRepository.findById(id);

    // TODO VERIFICAR PERMISSÕES

    if (!machineCategory) {
      throw AppError.machineCategoryNotFound;
    }

    return machineCategory;
  }
}

export default ShowMachineCategoryService;
