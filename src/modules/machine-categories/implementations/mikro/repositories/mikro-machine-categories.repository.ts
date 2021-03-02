import CreateMachineCategoryDto from '@modules/machine-categories/contracts/dtos/create-machine-category-dto';
import FindByLabelAndOwnerIdDto from '@modules/machine-categories/contracts/dtos/find-by-label-and-owner-id-dto';
import MachineCategory from '@modules/machine-categories/contracts/models/machine-category';
import MachineCategoriesRepository from '@modules/machine-categories/contracts/repositories/machine-categories-repository';
import MikroMapper from '@providers/orm-provider/implementations/mikro/mikro-mapper';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroMachineCategory from '../models/mikro-machine-category';

class MikroMachineCategoriesRepository implements MachineCategoriesRepository {
  private ormProvider: MikroOrmProvider;

  constructor() {
    this.ormProvider = container.resolve<MikroOrmProvider>('OrmProvider');
  }

  async findByOwnerId(ownerId: string): Promise<MachineCategory[]> {
    const mikroMachineCategories = await this.ormProvider.entityManager.find(
      MikroMachineCategory,
      { ownerId },
    );

    const machineCategories = mikroMachineCategories.map(mikroMachineCategory =>
      MikroMapper.map(mikroMachineCategory),
    );

    return machineCategories;
  }

  async findByLabelAndOwnerId({
    label,
    ownerId,
  }: FindByLabelAndOwnerIdDto): Promise<MachineCategory | undefined> {
    const mikroMachineCategory = await this.ormProvider.entityManager.findOne(
      MikroMachineCategory,
      { label, ownerId },
    );

    if (mikroMachineCategory) return MikroMapper.map(mikroMachineCategory);

    return undefined;
  }

  create(data: CreateMachineCategoryDto): MachineCategory {
    const mikroMachineCategory = new MikroMachineCategory(data);
    this.ormProvider.entityManager.persist(mikroMachineCategory);

    return MikroMapper.map(mikroMachineCategory);
  }
}

export default MikroMachineCategoriesRepository;
