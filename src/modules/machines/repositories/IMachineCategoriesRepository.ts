import ICreateMachineCategoryDTO from '../dtos/ICreateMachineCategoryDTO';
import MachineCategory from '../infra/typeorm/entities/MachineCategory';

export default interface IMachineCategoriesRepository {
  create(data: ICreateMachineCategoryDTO): Promise<MachineCategory>;
  listAllCategories(ownerId: number): Promise<MachineCategory[]>;
  findById(id: number): Promise<MachineCategory | undefined>;
  save(machineCategory: MachineCategory): Promise<void>;
}
