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
    orderByLastCollection,
    orderByLastConnection,
    checkLastCollectionExists,
    fields,
    checkLocationExists,
  }: FindMachinesDto): Promise<Machine[]> {
    const telemetryStatusQuery: Record<string, unknown> = {};
    const lastCollectionQuery: Record<string, unknown> = {};
    const lastConnectionQuery: Record<string, unknown> = {};

    if (orderByLastConnection && checkLastCollectionExists) {
      telemetryStatusQuery.lastConnection = {
        $exists: true,
        $ne: null,
      };
    }

    if (orderByLastCollection) {
      lastCollectionQuery.lastCollection = {
        $exists: true,
        $ne: null,
      };
    }

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
          $ne: null,
        };
        telemetryStatusQuery.lastConnection = null;
      }

      if (telemetryStatus === 'NO_TELEMETRY') {
        telemetryStatusQuery.telemetryBoardId = null;
      }
    }

    const result = await this.repository.find(
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
        ...(checkLocationExists && { locationId: { $ne: null } }),
        ...(serialNumber && {
          serialNumber: new RegExp(serialNumber, 'i'),
        }),
        ...(isActive !== undefined && { isActive }),
        ...telemetryStatusQuery,
        ...lastCollectionQuery,
        ...lastConnectionQuery,
      },
      {
        ...(orderByLastCollection && {
          orderBy: {
            lastCollection: 'ASC',
          },
        }),
        ...(orderByLastConnection && {
          orderBy: {
            lastConnection: 'ASC',
          },
        }),
        limit,
        offset,
        fields,
        populate,
      },
    );

    const machines = result.map(machine => MachineMapper.toEntity(machine));

    return machines;
  }

  async findAndCount({
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
    orderByLastCollection,
    orderByLastConnection,
    checkLastCollectionExists,
    fields,
  }: FindMachinesDto): Promise<{ machines: Machine[]; count: number }> {
    const telemetryStatusQuery: Record<string, unknown> = {};
    const lastCollectionQuery: Record<string, unknown> = {};
    const lastConnectionQuery: Record<string, unknown> = {};

    if (orderByLastConnection && checkLastCollectionExists) {
      telemetryStatusQuery.lastConnection = {
        $exists: true,
        $ne: null,
      };
    }

    if (orderByLastCollection) {
      lastCollectionQuery.lastCollection = {
        $exists: true,
        $ne: null,
      };
    }

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
          $ne: null,
        };
        telemetryStatusQuery.lastConnection = null;
      }

      if (telemetryStatus === 'NO_TELEMETRY') {
        telemetryStatusQuery.telemetryBoardId = null;
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
        ...lastCollectionQuery,
        ...lastConnectionQuery,
      },
      {
        ...(orderByLastCollection && {
          orderBy: {
            lastCollection: 'ASC',
          },
        }),
        ...(orderByLastConnection && {
          orderBy: {
            lastConnection: 'ASC',
          },
        }),
        limit,
        offset,
        fields,
        populate,
      },
    );

    const machines = result.map(machine => MachineMapper.toEntity(machine));

    return { machines, count };
  }

  async machineSortedByStock({
    groupIds,
    operatorId,
    pointOfSaleId,
  }: FindMachinesDto): Promise<
    {
      id: string;
      serialNumber: string;
      total: number;
      minimumPrizeCount: number;
    }[]
  > {
    const stages: unknown[] = [
      {
        $match: {
          locationId: {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $match: {
          lastConnection: {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $match: {
          minimumPrizeCount: {
            $exists: true,
            $ne: null,
          },
        },
      },
      {
        $project: {
          id: '$_id',
          serialNumber: '$serialNumber',
          minimumPrizeCount: '$minimumPrizeCount',
          lastConnection: '$lastConnection',
          categoryLabel: '$categoryLabel',
          groupId: '$groupId',
          priority: {
            $subtract: [
              { $sum: '$boxes.numberOfPrizes' },
              '$minimumPrizeCount',
            ],
          },
          total: {
            $sum: '$boxes.numberOfPrizes',
          },
        },
      },
      {
        $sort: {
          priority: 1,
        },
      },
      {
        $limit: 5,
      },
    ];

    if (operatorId) {
      stages.unshift({
        $match: {
          operatorId: { $eq: operatorId },
        },
      });
    }

    if (groupIds) {
      stages.unshift({
        $match: {
          groupId: {
            $in: groupIds,
          },
        },
      });
    }

    if (pointOfSaleId) {
      stages.unshift({
        $match: {
          locationId: {
            $in: pointOfSaleId,
          },
        },
      });
    }

    const machines = await this.repository.aggregate(stages);

    return machines;
  }

  async count({
    ownerId,
    telemetryStatus,
    operatorId,
    groupIds,
    pointOfSaleId,
    checkLocationExists,
  }: FindMachinesDto): Promise<number> {
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
          $ne: null,
        };
        telemetryStatusQuery.lastConnection = null;
      }

      if (telemetryStatus === 'NO_TELEMETRY') {
        telemetryStatusQuery.telemetryBoardId = null;
      }
    }

    const count = await this.repository.count({
      ...(ownerId && { ownerId }),
      ...(groupIds && { groupId: groupIds }),
      ...(operatorId && { operatorId }),
      ...(pointOfSaleId && { locationId: pointOfSaleId }),
      ...(checkLocationExists &&
        !pointOfSaleId && { locationId: { $ne: null } }),
      ...telemetryStatusQuery,
      isActive: true,
    });

    return count;
  }

  async machinePerCategory({ groupIds }: FindMachinesDto): Promise<
    {
      categoryLabel: string;
      totalInStock: number;
      totalInOperation: number;
    }[]
  > {
    const stages: unknown[] = [
      {
        $match: {
          groupId: {
            $in: groupIds,
          },
        },
      },
      {
        $group: {
          _id: '$categoryLabel',
          totalInStock: {
            $sum: {
              $cond: [{ $eq: ['$locationId', null] }, 1, 0],
            },
          },
          totalInOperation: {
            $sum: {
              $cond: [{ $eq: ['$locationId', null] }, 0, 1],
            },
          },
        },
      },
      {
        $project: {
          categoryLabel: '$_id',
          _id: 0,
          totalInStock: 1,
          totalInOperation: 1,
        },
      },
    ];

    const response = await this.repository.aggregate(stages);

    return response;
  }

  async machinesInventoryByProduct({ groupIds }: FindMachinesDto): Promise<
    {
      prizeId: string;
      prizeLabel: string;
      totalPrizes: string;
      count: number;
    }[]
  > {
    const stages: unknown[] = [
      {
        $match: {
          groupId: {
            $in: groupIds,
          },
        },
      },
      {
        $group: {
          _id: '$typeOfPrize',
          arrayOfValues: {
            $push: '$boxes.numberOfPrizes',
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          count: 1,
          prizesArray: {
            $reduce: {
              input: {
                $map: {
                  input: '$arrayOfValues',
                  in: '$$this',
                },
              },
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this'] },
            },
          },
        },
      },
      {
        $project: {
          count: 1,
          prizeId: '$_id.id',
          prizeLabel: '$_id.label',
          totalPrizes: {
            $reduce: {
              input: '$prizesArray',
              initialValue: 0,
              in: { $add: ['$$value', '$$this'] },
            },
          },
          _id: 0,
        },
      },
    ];

    const response = await this.repository.aggregate(stages);

    return response;
  }

  save(data: Machine): void {
    const reference = this.repository.getReference(data.id);
    const machine = this.repository.assign(reference, data);
    this.repository.persist(machine);
  }
}

export default MikroMachinesRepository;
