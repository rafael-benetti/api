import FindEntityDto from '@shared/contracts/dtos/find-entity.dto';
import CreateMachineCategoryDto from '../dtos/create-machine-category-dto';
import MachineCategory from '../models/machine-category';

export default interface MachineCategoriesRepository {
  create(data: CreateMachineCategoryDto): MachineCategory;
  findOne(
    data: FindEntityDto<MachineCategory>,
  ): Promise<MachineCategory | undefined>;
  find(data: FindEntityDto<MachineCategory>): Promise<MachineCategory[]>;
  save(data: MachineCategory): void;
}
