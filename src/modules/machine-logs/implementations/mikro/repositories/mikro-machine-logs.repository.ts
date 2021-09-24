import CreateMachineLogDto from '@modules/machine-logs/contracts/dtos/create-machine-log.dto';
import FindMachineLogsDto from '@modules/machine-logs/contracts/dtos/find-machine-logs.dto';
import MachineLog from '@modules/machine-logs/contracts/entities/machine-log';
import MachineLogsRepository from '@modules/machine-logs/contracts/repositories/machine-logs.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroMachineLog from '../entities/mikro-machine-log';
import MachineLogMapper from '../mappers/machine-log.mapper';

class MikroMachineLogsRepository implements MachineLogsRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroMachineLog);

  create(data: CreateMachineLogDto): MachineLog {
    const mikroMachineLog = new MikroMachineLog(data);
    this.repository.persist(mikroMachineLog);
    return MachineLogMapper.toEntity(mikroMachineLog);
  }

  async find({
    machineId,
    groupId,
    type,
    startDate,
    endDate,
    fields,
    populate,
    limit,
    offset,
  }: FindMachineLogsDto): Promise<MachineLog[]> {
    const machineLogs = await this.repository.find(
      {
        ...(machineId && { machineId }),
        groupId,
        ...(type && { type }),
        ...(startDate && {
          createdAt: {
            $gte: startDate,
          },
        }),
        ...(endDate && {
          createdAt: {
            $lte: endDate,
          },
        }),
      },
      {
        limit,
        offset,
        orderBy: {
          createdAt: 'DESC',
        },
        populate,
        fields,
      },
    );

    return machineLogs;
  }

  async remoteCreditAmount({
    startDate,
    endDate,
    machineId,
    groupId,
  }: FindMachineLogsDto): Promise<
    [{ remoteCreditAmount: number; machineId: string }]
  > {
    const remoteCreditAmount = await this.repository.aggregate([
      {
        $match: {
          machineId: {
            $in: machineId,
          },
          groupId: {
            $in: groupId,
          },
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          type: 'REMOTE_CREDIT',
        },
      },
      {
        $group: {
          _id: '$machineId',
          remoteCreditAmount: {
            $sum: { $toInt: '$quantity' },
          },
        },
      },
      {
        $project: {
          machineId: '$_id',
          remoteCreditAmount: 1,
          _id: 0,
        },
      },
    ]);

    return remoteCreditAmount as [
      { remoteCreditAmount: number; machineId: string },
    ];
  }

  async findAndCount({
    machineId,
    groupId,
    type,
    startDate,
    endDate,
    fields,
    populate,
    limit,
    offset,
  }: FindMachineLogsDto): Promise<{
    machineLogs: MachineLog[];
    count: number;
  }> {
    const [machineLogs, count] = await this.repository.findAndCount(
      {
        machineId,
        groupId,
        ...(type && { type }),
        ...(startDate && {
          createdAt: {
            $gte: startDate,
          },
        }),
        ...(endDate && {
          createdAt: {
            $lte: endDate,
          },
        }),
      },
      {
        limit,
        offset,
        orderBy: {
          createdAt: 'DESC',
        },
        populate,
        fields,
      },
    );

    return { machineLogs, count };
  }

  save(data: MachineLog): void {
    const reference = this.repository.getReference(data.id);
    const machineLog = this.repository.assign(reference, data);
    this.repository.persist(machineLog);
  }
}

export default MikroMachineLogsRepository;
