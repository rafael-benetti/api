import CreateTelemetryBoardDto from '../dtos/create-telemetry-board.dto';
import TelemetryBoard from '../entities/telemetry-board';

interface TelemetryBoardsRepository {
  create(data: CreateTelemetryBoardDto): TelemetryBoard;
}

export default TelemetryBoardsRepository;
