import TelemetryBoard from '@modules/telemetry/contracts/entities/telemetry-board';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';
import { inject, injectable } from 'tsyringe';

@injectable()
class GetAllTelemetryBoardsService {
  constructor(
    @inject('TelemetryBoardsRepository')
    private telemetryBoardsRepository: TelemetryBoardsRepository,
  ) {}

  async execute(): Promise<TelemetryBoard[]> {
    const { telemetryBoards } = await this.telemetryBoardsRepository.find({
      filters: {},
    });

    return telemetryBoards;
  }
}

export default GetAllTelemetryBoardsService;
