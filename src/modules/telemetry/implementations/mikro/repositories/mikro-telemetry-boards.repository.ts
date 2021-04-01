import CreateTelemetryBoardDto from '@modules/telemetry/contracts/dtos/create-telemetry-board.dto';
import TelemetryBoard from '@modules/telemetry/contracts/entities/telemetry-board';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroTelemetryBoard from '../entities/mikro-telemetry-board';
import TelemetryBoardMapper from '../mappers/telemetry-board.mapper';

class MikroTelemetryBoardsRepository implements TelemetryBoardsRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroTelemetryBoard);

  create(data: CreateTelemetryBoardDto): TelemetryBoard {
    const telemetryBoard = new MikroTelemetryBoard(data);
    this.repository.persist(telemetryBoard);
    return TelemetryBoardMapper.toApi(telemetryBoard);
  }
}

export default MikroTelemetryBoardsRepository;
