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
    filters,
  }: FindMachinesDto): Promise<Machine[]> {
    const machines = await this.repository.find({
      ...(id && { id }),
      ...(operatorId && { operatorId }),
      ...(ownerId && { ownerId }),
      ...(groupIds && { groupId: groupIds }),
      ...(filters?.categoryId && { categoryId: filters.categoryId }),
      ...(filters?.groupId && { groupId: filters.groupId }),
      ...(filters?.pointOfSaleId && { pointOfSaleId: filters.pointOfSaleId }),
      ...(filters?.routeId && { routeId: filters.routeId }),
      ...(filters?.serialNumber && {
        serialNumber: new RegExp(filters.serialNumber),
      }),
    });

    return machines.map(machine => MachineMapper.toEntity(machine));
  }

  save(data: Machine): void {
    this.repository.persist(MachineMapper.toMikroEntity(data));
  }
}

export default MikroMachinesRepository;
