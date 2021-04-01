import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  telemetryId: string;
}

@injectable()
class ReceiveTelemetryMessageService {
  constructor(
    @inject('TelemetryBoardsRepository')
    private telemetryBoardsRepository: TelemetryBoardsRepository,
  ) {}

  async execute({ telemetryId }: Request): Promise<void> {
    const telemetryBoard = await this.telemetryBoardsRepository.findById(
      telemetryId,
    );

    if (!telemetryBoard) throw AppError.telemetryBoardNotFound;
  }
}

export default ReceiveTelemetryMessageService;
