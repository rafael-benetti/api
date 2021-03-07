import CreateMachineDto from '@modules/machines/contracts/dtos/create-machine.dto';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import MikroMapper from '@providers/orm-provider/implementations/mikro/mikro-mapper';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import FindEntityDto from '@shared/contracts/dtos/find-entity.dto';
import { container } from 'tsyringe';
import MikroMachine from '../models/mikro-machine';

class MikroMachinesRepository implements MachinesRepository {
  private entityManager = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroMachine);

  create(data: CreateMachineDto): Machine {
    const machine = new MikroMachine(data);
    this.entityManager.persist(machine);
    return MikroMapper.map(machine);
  }

  async findOne({
    filters,
    populate,
  }: FindEntityDto<Machine>): Promise<Machine | undefined> {
    const machine = await this.entityManager.findOne({ ...filters }, populate);

    return machine ? MikroMapper.map(machine) : undefined;
  }

  async find({
    limit,
    offset,
    filters,
    populate,
  }: FindEntityDto<Machine>): Promise<Machine[]> {
    const machines = await this.entityManager.find(
      {
        ...filters,
      },
      { limit, offset, populate },
    );

    return machines.map(machine => MikroMapper.map(machine));
  }

  save(data: Machine): void {
    const machine = MikroMapper.map(data);
    this.entityManager.persist(machine);
  }

  delete(data: Machine): void {
    const machine = MikroMapper.map(data);
    machine.deleted = true;
    this.entityManager.persist(machine);
  }
}

export default MikroMachinesRepository;
