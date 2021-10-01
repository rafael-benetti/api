import CreateLogDto from '../dtos/create-log.dto';
import FindAndCountLogsDto from '../dtos/list-log.dto';
import Log from '../models/log';

interface LogsRepository {
  create(data: CreateLogDto): Log;
  findAndCount(
    data: FindAndCountLogsDto,
  ): Promise<{ logs: Log[]; count: number }>;
}

export default LogsRepository;
