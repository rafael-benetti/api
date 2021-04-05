import CreateMachineDto from '@modules/machines/contracts/dtos/create-machine.dto';
import FindMachineDto from '@modules/machines/contracts/dtos/find-machine.dto';
import FindMachinesDto from '@modules/machines/contracts/dtos/find-machines.dto';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MachineMapper from '../mapper/machine.mapper';
import MikroMachine from '../models/mikro-machine';

class MikroMachinesRepository implements MachinesRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroMachine);

  create(data: CreateMachineDto): Machine {
    const mikroMachine = new MikroMachine(data);
    this.repository.persist(mikroMachine);
    return MachineMapper.toEntity(mikroMachine);
  }

  async findOne(data: FindMachineDto): Promise<Machine | undefined> {
    const machine = await this.repository.findOne({
      [data.by]: data.value,
    });

    return machine ? MachineMapper.toEntity(machine) : undefined;
  }

  async find({
    id,
    ownerId,
    groupIds,
    operatorId,
    categoryId,
    pointOfSaleId,
    serialNumber,
    isActive,
    limit,
    offset,
  }: FindMachinesDto): Promise<{ machines: Machine[]; count: number }> {
    const [result, count] = await this.repository.findAndCount(
      {
        ...(id && { id }),
        ...(operatorId && { operatorId }),
        ...(ownerId && { ownerId }),
        ...(groupIds && { groupId: groupIds }),
        ...(categoryId && { categoryId }),
        ...(pointOfSaleId !== undefined && {
          locationId: pointOfSaleId === 'null' ? null : pointOfSaleId,
        }),
        ...(serialNumber && {
          serialNumber: new RegExp(serialNumber),
        }),
        ...(isActive !== undefined && { isActive }),
      },
      {
        limit,
        offset,
      },
    );

    const machines = result.map(machine => MachineMapper.toEntity(machine));

    return { machines, count };
  }

  save(data: Machine): void {
    this.repository.persist(MachineMapper.toMikroEntity(data));
  }
}

export default MikroMachinesRepository;
