import CreateTelemetryBoardDto from '../dtos/create-telemetry-board.dto';
import FindTelemetryBoardsDto from '../dtos/find-telemetry-boards.dto';
import TelemetryBoard from '../entities/telemetry-board';

interface TelemetryBoardsRepository {
  create(data: CreateTelemetryBoardDto): Promise<TelemetryBoard>;
  findById(id: number): Promise<TelemetryBoard | undefined>;
  find(data: FindTelemetryBoardsDto): Promise<TelemetryBoard[]>;
  save(data: TelemetryBoard): void;
}

export default TelemetryBoardsRepository;
