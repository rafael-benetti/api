import CreateTelemetryBoardDto from '../dtos/create-telemetry-board.dto';
import FindTelemetryBoardsDto from '../dtos/find-telemetry-boards.dto';
import TelemetryBoard from '../entities/telemetry-board';

interface TelemetryBoardsRepository {
  create(data: CreateTelemetryBoardDto): TelemetryBoard;
  findById(id: string): Promise<TelemetryBoard | undefined>;
  find(data: FindTelemetryBoardsDto): Promise<TelemetryBoard[]>;
  save(data: TelemetryBoard): void;
}

export default TelemetryBoardsRepository;
