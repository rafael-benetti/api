import CreateMachineCategoryDto from '../dtos/create-machine-category-dto';
import MachineCategory from '../models/machine-category';

export default interface MachineCategoriesRepository {
  create(data: CreateMachineCategoryDto): MachineCategory;
}
