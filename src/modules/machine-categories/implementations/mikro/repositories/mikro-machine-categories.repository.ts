import CreateMachineCategoryDto from '@modules/machine-categories/contracts/dtos/create-machine-category-dto';
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

  create(data: CreateMachineCategoryDto): MachineCategory {
    const mikroMachineCategory = new MikroMachineCategory(data);
    this.ormProvider.entityManager.persist(mikroMachineCategory);

    return MikroMapper.map(mikroMachineCategory);
  }
}

export default MikroMachineCategoriesRepository;
