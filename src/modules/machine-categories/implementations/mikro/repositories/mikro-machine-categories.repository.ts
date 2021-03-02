import CreateMachineCategoryDto from '@modules/machine-categories/contracts/dtos/create-machine-category-dto';
import FindByLabelAndOwnerIdDto from '@modules/machine-categories/contracts/dtos/find-by-label-and-owner-id-dto';
import FindMachineCategoryDto from '@modules/machine-categories/contracts/dtos/find-machine-category.dto';
import MachineCategory from '@modules/machine-categories/contracts/models/machine-category';
import MachineCategoriesRepository from '@modules/machine-categories/contracts/repositories/machine-categories-repository';
import MikroMapper from '@providers/orm-provider/implementations/mikro/mikro-mapper';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroMachineCategory from '../models/mikro-machine-category';

class MikroMachineCategoriesRepository implements MachineCategoriesRepository {
  private entityManager = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroMachineCategory);

  async findByOwnerId(ownerId: string): Promise<MachineCategory[]> {
    const mikroMachineCategories = await this.entityManager.find({ ownerId });

    const machineCategories = mikroMachineCategories.map(mikroMachineCategory =>
      MikroMapper.map(mikroMachineCategory),
    );

    return machineCategories;
  }

  async findByLabelAndOwnerId({
    label,
    ownerId,
  }: FindByLabelAndOwnerIdDto): Promise<MachineCategory | undefined> {
    const mikroMachineCategory = await this.entityManager.findOne({
      label,
      ownerId,
    });

    if (mikroMachineCategory) return MikroMapper.map(mikroMachineCategory);

    return undefined;
  }

  async find(data: FindMachineCategoryDto): Promise<MachineCategory[]> {
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

  async findOne(
    data: FindMachineCategoryDto,
  ): Promise<MachineCategory | undefined> {
    const machineCategory = await this.entityManager.findOne(
      {
        ...data.filters,
      },
      data.populate,
    );

    return machineCategory ? MikroMapper.map(machineCategory) : undefined;
  }

  create(data: CreateMachineCategoryDto): MachineCategory {
    const mikroMachineCategory = new MikroMachineCategory(data);
    this.entityManager.persist(mikroMachineCategory);

    return MikroMapper.map(mikroMachineCategory);
  }

  save(data: MachineCategory): void {
    const machineCategory = MikroMapper.map(data);
    this.entityManager.persist(machineCategory);
  }
}

export default MikroMachineCategoriesRepository;
