import CreateLogDto from '@modules/logs/contracts/dtos/create-log.dto';
import DeleteLogsDto from '@modules/logs/contracts/dtos/delete-logs.dto';
import FindAndCountLogsDto from '@modules/logs/contracts/dtos/list-log.dto';
import Log from '@modules/logs/contracts/models/log';
import LogsRepository from '@modules/logs/contracts/repositories/logs-repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import LogMapper from '../models/log-mapper';
import MikroLog from '../models/mikro-log';

class MikroLogsRepository implements LogsRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroLog);

  create(data: CreateLogDto): Log {
    const mikroLog = new MikroLog(data);
    this.repository.persist(mikroLog);
    return LogMapper.toEntity(mikroLog);
  }

  async findAndCount({
    filters,
    limit,
    offset,
  }: FindAndCountLogsDto): Promise<{ logs: Log[]; count: number }> {
    const [mikroLogs, count] = await this.repository.findAndCount(
      {
        ...(filters.startDate && { createdAt: { $gte: filters.startDate } }),
        ...(filters.endDate && { createdAt: { $lte: filters.endDate } }),
        ...(filters.type && { type: { $in: filters.type } }),
        ...(filters.ownerId && { ownerId: filters.ownerId }),
      },
      {
        limit,
        offset,
        orderBy: {
          createdAt: 'DESC',
        },
        populate: [
          'user',
          'machine',
          'group',
          'pos',
          'route',
          'collection',
          'affectedGroup',
          'owner',
          'createdByUser',
          'destination',
        ],
      },
    );

    return {
      logs: mikroLogs.map(mikroLog => LogMapper.toEntity(mikroLog)),
      count,
    };
  }

  async delete({ startDate, ownerId, type }: DeleteLogsDto): Promise<number> {
    const count = await this.repository.nativeDelete({
      createdAt: {
        $lte: startDate,
      },
      ...(ownerId && { ownerId }),
      ...(type && { type }),
    });

    return count;
  }
}

export default MikroLogsRepository;
