import AdminsRepository from '@modules/admins/contracts/repositories/admins.repository';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  adminId: string;
  telemetryId: string;
}

@injectable()
class ReceiveTelemetryMessageService {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,

    @inject('TelemetryBoardsRepository')
    private telemetryBoardsRepository: TelemetryBoardsRepository,
  ) {}

  async execute({ adminId, telemetryId }: Request): Promise<void> {
    const admin = await this.adminsRepository.findOne({
      by: 'id',
      value: adminId,
    });

    if (!admin) throw AppError.authorizationError;

    const telemetryBoard = await this.telemetryBoardsRepository.findById(
      telemetryId,
    );

    if (!telemetryBoard) throw AppError.telemetryBoardNotFound;
  }
}

export default ReceiveTelemetryMessageService;
