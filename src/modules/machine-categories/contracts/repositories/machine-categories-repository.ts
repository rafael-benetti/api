import CreateMachineCategoryDto from '../dtos/create-machine-category-dto';
import FindMachineCategoryDto from '../dtos/find-machine-category.dto';
import MachineCategory from '../models/machine-category';

export default interface MachineCategoriesRepository {
  create(data: CreateMachineCategoryDto): MachineCategory;
  findOne(data: FindMachineCategoryDto): Promise<MachineCategory | undefined>;
  find(data: FindMachineCategoryDto): Promise<MachineCategory[]>;
  save(data: MachineCategory): void;
}
