import CreateMachineDto from '@modules/machines/contracts/dtos/create-machine.dto';
import FindMachineDto from '@modules/machines/contracts/dtos/find-machine.dto';
import FindMachinesDto from '@modules/machines/contracts/dtos/find-machines.dto';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { addMinutes } from 'date-fns';
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
    const machine = await this.repository.findOne(
      {
        [data.by]: data.value,
      },
      {
        populate: data.populate,
      },
    );

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
    telemetryBoardId,
    telemetryStatus,
    limit,
    offset,
    populate,
  }: FindMachinesDto): Promise<{ machines: Machine[]; count: number }> {
    const telemetryStatusQuery: Record<string, unknown> = {};
    if (telemetryStatus) {
      if (telemetryStatus === 'ONLINE') {
        telemetryStatusQuery.lastConnection = {
          $gte: addMinutes(new Date(), -10),
        };
      }

      if (telemetryStatus === 'OFFLINE') {
        telemetryStatusQuery.lastConnection = {
          $lt: addMinutes(new Date(), -10),
        };
      }

      if (telemetryStatus === 'VIRGIN') {
        telemetryStatusQuery.telemetryBoardId = {
          $exists: true,
        };
        telemetryStatusQuery.lastConnection = {
          $exists: false,
        };
      }

      if (telemetryStatus === 'NO_TELEMETRY') {
        telemetryStatusQuery.telemetryBoardId = {
          $exists: false,
        };
      }
    }

    const [result, count] = await this.repository.findAndCount(
      {
        ...(id && { id }),
        ...(operatorId && { operatorId }),
        ...(ownerId && { ownerId }),
        ...(groupIds && { groupId: groupIds }),
        ...(telemetryBoardId && { telemetryBoardId }),
        ...(categoryId && { categoryId }),
        ...(pointOfSaleId !== undefined && {
          locationId: pointOfSaleId === 'null' ? null : pointOfSaleId,
        }),
        ...(serialNumber && {
          serialNumber: new RegExp(serialNumber, 'i'),
        }),
        ...(isActive !== undefined && { isActive }),
        ...telemetryStatusQuery,
      },
      {
        limit,
        offset,
        populate,
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
