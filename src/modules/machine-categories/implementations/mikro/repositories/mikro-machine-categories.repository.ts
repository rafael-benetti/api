import CreateMachineCategoryDto from '@modules/machine-categories/contracts/dtos/create-machine-category-dto';
import MachineCategory from '@modules/machine-categories/contracts/models/machine-category';
import MachineCategoriesRepository from '@modules/machine-categories/contracts/repositories/machine-categories-repository';
import MikroMapper from '@providers/orm-provider/implementations/mikro/mikro-mapper';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import FindEntityDto from '@shared/contracts/dtos/find-entity.dto';
import { container } from 'tsyringe';
import MikroMachineCategory from '../models/mikro-machine-category';

class MikroMachineCategoriesRepository implements MachineCategoriesRepository {
  private entityManager = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroMachineCategory);

  create(data: CreateMachineCategoryDto): MachineCategory {
    const mikroMachineCategory = new MikroMachineCategory(data);
    this.entityManager.persist(mikroMachineCategory);

    return MikroMapper.map(mikroMachineCategory);
  }

  async findOne(
    data: FindEntityDto<MachineCategory>,
  ): Promise<MachineCategory | undefined> {
    const machineCategory = await this.entityManager.findOne(
      {
        ...data.filters,
      },
      data.populate,
    );

    return machineCategory ? MikroMapper.map(machineCategory) : undefined;
  }

  async find(data: FindEntityDto<MachineCategory>): Promise<MachineCategory[]> {
    const machineCategories = await this.entityManager.find(
      {
        ...data.filters,
      },
      {
        populate: data.populate,
        limit: data.limit,
        offset: data.offset,
      },
    );

    return machineCategories.map(machineCategory =>
      MikroMapper.map(machineCategory),
    );
  }

  save(data: MachineCategory): void {
    const machineCategory = MikroMapper.map(data);
    this.entityManager.persist(machineCategory);
  }
}

export default MikroMachineCategoriesRepository;
