import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import LogType from '@modules/logs/contracts/enums/log-type.enum';
import Log from '@modules/logs/contracts/models/log';
import LogsRepository from '@modules/logs/contracts/repositories/logs-repository';
import AppError from '@shared/errors/app-error';
import { injectable, inject } from 'tsyringe';

interface Request {
  adminId: string;
  filters: {
    startDate?: Date;
    endDate?: Date;
    ownerId?: string;
    type?: LogType[];
  };
  limit: number;
  offset: number;
}

@injectable()
class ListLogsService {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,

    @inject('LogsRepository')
    private logsRepository: LogsRepository,
  ) {}

  async execute({
    adminId,
    limit,
    filters,
    offset,
  }: Request): Promise<{ logs: Log[]; count: number }> {
    const { endDate, ownerId, startDate, type } = filters;
    const admin = await this.adminsRepository.findOne({
      by: 'id',
      value: adminId,
    });

    if (!admin) throw AppError.authorizationError;

    const logs = await this.logsRepository.findAndCount({
      filters: {
        endDate,
        ownerId,
        type,
        startDate,
      },
      limit,
      offset,
    });

    return logs;
  }
}

export default ListLogsService;
