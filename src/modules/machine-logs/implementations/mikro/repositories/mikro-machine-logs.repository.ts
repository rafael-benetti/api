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
          createdAt: 'ASC',
        },
      },
    );

    return { machineLogs, count };
  }

  save(data: MachineLog): void {
    this.repository.persist(MachineLogMapper.toMikroEntity(data));
  }
}

export default MikroMachineLogsRepository;
