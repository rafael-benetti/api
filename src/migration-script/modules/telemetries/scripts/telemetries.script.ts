/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { inject, injectable } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import Redis from 'ioredis';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import AppError from '@shared/errors/app-error';
import TypeMachinesRepository from 'migration-script/modules/machines/typeorm/repositories/type-machines.repository';
import TypeTelemetriesRepository from '../typeorm/repositories/type-telemetries.repository';

@injectable()
class TelemetriesScript {
  private client = new Redis();

  constructor(
    @inject('TypeTelemetriesRepository')
    private typeTelemetriesRepository: TypeTelemetriesRepository,

    @inject('TelemetryBoardsRepository')
    private telemetryBoardsRepository: TelemetryBoardsRepository,

    @inject('TypeMachinesRepository')
    private typeMachinesRepository: TypeMachinesRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute(): Promise<void> {
    const typeTelemetries = await this.typeTelemetriesRepository.find();

    let count = 1;
    for (const typeTelemetry of typeTelemetries) {
      while (count < typeTelemetry.id) {
        await this.telemetryBoardsRepository.create({
          connectionStrength: undefined,
          lastConnection: undefined,
          connectionType: undefined,
          groupId: 'null',
          integratedCircuitCardId: undefined,
          ownerId: 'null',
          machineId: undefined,
        });

        await this.ormProvider.commit();

        count += 1;
      }

      const groupId = (await this.client.get(
        `@groups:${typeTelemetry.companyId}`,
      )) as string;

      const group = await this.groupsRepository.findOne({
        by: 'id',
        value: groupId,
      });

      if (!group) throw AppError.groupNotFound;

      const typeMachine = await this.typeMachinesRepository.findOne(
        typeTelemetry.id,
      );

      const telemetry = await this.telemetryBoardsRepository.create({
        connectionStrength: undefined,
        lastConnection: typeTelemetry.lastCommunication,
        connectionType: typeTelemetry.connectionType,
        groupId,
        integratedCircuitCardId: typeTelemetry.iccid?.toString(),
        ownerId: group.ownerId,
        machineId: typeMachine?.id.toString(),
      });

      await this.ormProvider.commit();
      count += 1;

      await this.client.set(
        `@telemetryBoards:${typeTelemetry.id}`,
        `${telemetry.id}`,
      );
    }

    this.ormProvider.clear();
  }
}

export default TelemetriesScript;
