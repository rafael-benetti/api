import CreateLogDto from '../dtos/create-log.dto';
import DeleteLogsDto from '../dtos/delete-logs.dto';
import FindAndCountLogsDto from '../dtos/list-log.dto';
import Log from '../models/log';

interface LogsRepository {
  create(data: CreateLogDto): Log;
  findAndCount(
    data: FindAndCountLogsDto,
  ): Promise<{ logs: Log[]; count: number }>;

  delete(data: DeleteLogsDto): Promise<number>;
}

export default LogsRepository;
