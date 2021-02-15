import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import MachineCategory from '../infra/typeorm/entities/MachineCategory';
import IMachineCategoriesRepository from '../repositories/IMachineCategoriesRepository';

interface IRequest {
  id: number;
  name: string;
}

@injectable()
class UpdateMachineCategoriesService {
  constructor(
    @inject('MachineCategoriesRepository')
    private machineCategoriesRepository: IMachineCategoriesRepository,
  ) {}

  public async execute({ id, name }: IRequest): Promise<MachineCategory> {
    const machineCategory = await this.machineCategoriesRepository.findById(id);

    if (!machineCategory) throw AppError.machineCategoryNotFound;

    if (name) machineCategory.name = name;

    await this.machineCategoriesRepository.save(machineCategory);

    return machineCategory;
  }
}

export default UpdateMachineCategoriesService;
