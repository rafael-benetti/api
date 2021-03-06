import CreateTelemetryBoardDto from '@modules/telemetry/contracts/dtos/create-telemetry-board.dto';
import FindTelemetryBoardsDto from '@modules/telemetry/contracts/dtos/find-telemetry-boards.dto';
import TelemetryBoard from '@modules/telemetry/contracts/entities/telemetry-board';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { inject, injectable } from 'tsyringe';
import MikroTelemetryBoard from '../entities/mikro-telemetry-board';
import TelemetryBoardMapper from '../mappers/telemetry-board.mapper';

@injectable()
class MikroTelemetryBoardsRepository implements TelemetryBoardsRepository {
  private repository =
    this.ormProvider.entityManager.getRepository(MikroTelemetryBoard);

  constructor(
    @inject('OrmProvider')
    private ormProvider: MikroOrmProvider,
  ) {}

  async create(data: CreateTelemetryBoardDto): Promise<TelemetryBoard> {
    const id = (await this.repository.count()) + 1;
    const telemetryBoard = new MikroTelemetryBoard(data);
    telemetryBoard.id = id;

    this.repository.persist(telemetryBoard);
    return TelemetryBoardMapper.toApi(telemetryBoard);
  }

  async findById(id: number): Promise<TelemetryBoard | undefined> {
    const telemetryBoard = await this.repository.findOne(
      {
        id,
      },
      {
        populate: ['machine', 'group'],
        fields: [
          'ownerId',
          'groupId',
          'group',
          'machineId',
          'machine.serialNumber',
          'lastConnection',
          'connectionStrength',
          'connectionType',
        ],
      },
    );

    return telemetryBoard
      ? TelemetryBoardMapper.toApi(telemetryBoard)
      : undefined;
  }

  async find(data: FindTelemetryBoardsDto): Promise<{
    telemetryBoards: TelemetryBoard[];
    count: number;
  }> {
    const query: { [key: string]: unknown } = {};

    if (data.filters.groupIds && data.filters.groupIds.length > 0)
      query.groupId = {
        $in: data.filters.groupIds,
      };

    if (data.filters.id) {
      query.id = {
        $in: data.filters.id,
      };
    }

    if (data.filters.ownerId) query.ownerId = data.filters.ownerId;

    const [telemetryBoards, count] = await this.repository.findAndCount(
      { ...query },
      {
        limit: data.limit,
        offset: data.offset,
        populate: ['machine', 'group', 'owner'],
        ...(data.orderBy && {
          orderBy: {
            _id: data.orderBy,
          },
        }),
        fields: [
          'ownerId',
          'groupId',
          'group',
          'owner',
          'machineId',
          'machine.serialNumber',
          'lastConnection',
          'connectionStrength',
          'connectionType',
        ],
      },
    );

    return {
      telemetryBoards: telemetryBoards.map(board =>
        TelemetryBoardMapper.toApi(board),
      ),
      count,
    };
  }

  save(data: TelemetryBoard): void {
    const reference = this.repository.getReference(data.id);
    const telemetryBoard = this.repository.assign(reference, data);
    this.repository.persist(telemetryBoard);
  }
}

export default MikroTelemetryBoardsRepository;
