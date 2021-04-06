import CreateTelemetryBoardDto from '@modules/telemetry/contracts/dtos/create-telemetry-board.dto';
import FindTelemetryBoardsDto from '@modules/telemetry/contracts/dtos/find-telemetry-boards.dto';
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

  async findById(id: string): Promise<TelemetryBoard | undefined> {
    const telemetryBoard = await this.repository.findOne({
      id,
    });

    return telemetryBoard
      ? TelemetryBoardMapper.toApi(telemetryBoard)
      : undefined;
  }

  async find(data: FindTelemetryBoardsDto): Promise<TelemetryBoard[]> {
    const query: { [key: string]: unknown } = {};

    if (data.filters.groupIds)
      query.groupId = {
        $in: data.filters.groupIds,
      };

    if (data.filters.ownerId) query.ownerId = data.filters.ownerId;

    const telemetryBoards = (await this.repository.find(
      { ...query },
      { limit: data.limit, offset: data.offset, populate: data.populate },
    )) as MikroTelemetryBoard[];

    return telemetryBoards.map(board => TelemetryBoardMapper.toApi(board));
  }

  save(data: TelemetryBoard): void {
    const telemetryBoard = TelemetryBoardMapper.toOrm(data);
    this.repository.persist(telemetryBoard);
  }
}

export default MikroTelemetryBoardsRepository;
