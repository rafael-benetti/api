import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import LogType from '@modules/logs/contracts/enums/log-type.enum';
import LogsRepository from '@modules/logs/contracts/repositories/logs-repository';
import AppError from '@shared/errors/app-error';
import { injectable, inject } from 'tsyringe';

interface Request {
  adminId: string;
  startDate: Date;
  ownerId?: string;
  type?: LogType[];
}

@injectable()
class DeleteLogsService {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,

    @inject('LogsRepository')
    private logsRepository: LogsRepository,
  ) {}

  async execute({
    adminId,
    startDate,
    type,
    ownerId,
  }: Request): Promise<number> {
    const admin = await this.adminsRepository.findOne({
      by: 'id',
      value: adminId,
    });

    if (!admin) throw AppError.authorizationError;

    const count = await this.logsRepository.delete({
      ownerId,
      type,
      startDate,
    });

    return count;
  }
}

export default DeleteLogsService;
