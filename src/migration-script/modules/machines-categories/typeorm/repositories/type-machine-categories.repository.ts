/* eslint-disable import/no-extraneous-dependencies */
import { getRepository, Repository } from 'typeorm';
import TypeMachineCategory from '../entities/type-machine-category';

class MachineCategoriesRepository {
  private ormRepository: Repository<TypeMachineCategory>;

  constructor() {
    this.ormRepository = getRepository(TypeMachineCategory);
  }

  public async save(machineCategory: TypeMachineCategory): Promise<void> {
    await this.ormRepository.save(machineCategory);
  }

  public async findById(id: number): Promise<TypeMachineCategory | undefined> {
    const machineCategory = await this.ormRepository.findOne({ where: { id } });

    return machineCategory;
  }

  public async listAllCategories(
    userId: number,
  ): Promise<TypeMachineCategory[]> {
    const machineCategories = this.ormRepository.find({
      where: { ownerId: userId },
    });

    return machineCategories;
  }
}

export default MachineCategoriesRepository;
