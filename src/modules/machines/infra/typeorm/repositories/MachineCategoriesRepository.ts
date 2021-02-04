import ICreateMachineCategoryDTO from '@modules/machines/dtos/ICreateMachineCategoryDTO';
import IMachineCategoriesRepository from '@modules/machines/repositories/IMachineCategoriesRepository';
import { getRepository, Repository } from 'typeorm';
import MachineCategory from '../entities/MachineCategory';

class MachineCategoriesRepository implements IMachineCategoriesRepository {
  private ormRepository: Repository<MachineCategory>;

  constructor() {
    this.ormRepository = getRepository(MachineCategory);
  }

  public async findById(id: number): Promise<MachineCategory | undefined> {
    const machineCategory = await this.ormRepository.findOne({ where: { id } });

    return machineCategory;
  }

  public async listAllCategories(userId: number): Promise<MachineCategory[]> {
    const machineCategories = this.ormRepository.find({
      where: { ownerId: userId },
    });

    return machineCategories;
  }

  public async create({
    name,
    ownerId,
  }: ICreateMachineCategoryDTO): Promise<MachineCategory> {
    const machineCategory = this.ormRepository.create({
      active: 1,
      name,
      ownerId,
      giftSpaces: 0,
    });

    await this.ormRepository.save(machineCategory);

    return machineCategory;
  }
}

export default MachineCategoriesRepository;
