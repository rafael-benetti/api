import CreateMachineCategoryDto from '../dtos/create-machine-category-dto';
import FindByLabelAndOwnerIdDto from '../dtos/find-by-label-and-owner-id-dto';
import FindMachineCategoryDto from '../dtos/find-machine-category.dto';
import MachineCategory from '../models/machine-category';

export default interface MachineCategoriesRepository {
  create(data: CreateMachineCategoryDto): MachineCategory;
  findByOwnerId(ownerId: string): Promise<MachineCategory[]>;
  findByLabelAndOwnerId(
    data: FindByLabelAndOwnerIdDto,
  ): Promise<MachineCategory | undefined>;
  findOne(data: FindMachineCategoryDto): Promise<MachineCategory | undefined>;
  save(data: MachineCategory): void;
}
