/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { inject, injectable } from 'tsyringe';
import Redis from 'ioredis';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import AppError from '@shared/errors/app-error';
import TypeMachinesRepository from 'migration-script/modules/machines/typeorm/repositories/type-machines.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import logger from '@config/logger';
import TypeTelemetriesRepository from '../typeorm/repositories/type-telemetries.repository';

@injectable()
export default class TelemetriesScript {
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
      try {
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

        // const groupId = (await this.client.get(
        //   `@groups:${typeTelemetry.companyId}`,
        // )) as string;
        //
        // const group = await this.groupsRepository.findOne({
        //   by: 'id',
        //   value: groupId,
        // });

        // if (!group) throw AppError.groupNotFound;

        // const typeMachine = await this.typeMachinesRepository.findOne(
        //  typeTelemetry.id,
        // );

        // const telemetry =

        const listaDoIvan = [
          2,
          6,
          9,
          11,
          12,
          14,
          15,
          16,
          17,
          19,
          20,
          21,
          22,
          24,
          25,
          26,
          27,
          28,
          30,
          32,
          33,
          34,
          35,
          36,
          37,
          38,
          39,
          41,
          42,
          43,
          44,
        ];

        const vetorDoEdnilson = [31];

        const vetorDoLeo = [23];

        const vetorDoJucelio = [13];

        let groupId;
        let ownerId;
        if (listaDoIvan.includes(typeTelemetry.companyId)) {
          groupId = '8369b438-8f8e-41eb-a0d5-52148bf91689';
          ownerId = 'cb3f75bd-08e6-4419-b6e0-e2361677f4a8';
        }

        if (vetorDoEdnilson.includes(typeTelemetry.companyId)) {
          groupId = '736fc46c-75f7-4976-911d-a90d1ec54ea1';
          ownerId = '71399704-f727-4e63-aecb-eb290f64d278';
        }

        if (vetorDoJucelio.includes(typeTelemetry.companyId)) {
          groupId = 'd6736138-8b4e-42fc-841f-4312a57706b1';
          ownerId = '61bc37e5-e160-4752-b79d-621a9424657d';
        }

        if (vetorDoLeo.includes(typeTelemetry.companyId)) {
          groupId = '68fa01e7-faf0-4d2b-a038-b106046428be';
          ownerId = '50eb9e7d-538e-4b76-92c5-da050b230fd1';
        }

        await this.telemetryBoardsRepository.create({
          connectionStrength: undefined,
          lastConnection: undefined, // typeTelemetry.lastCommunication,
          connectionType: undefined, // typeTelemetry.connectionType,
          groupId: groupId || 'null',
          integratedCircuitCardId: typeTelemetry.iccid?.toString(),
          ownerId: ownerId || 'null', // group.ownerId,
          machineId: undefined, // typeMachine?.id.toString(),
        });

        await this.ormProvider.commit();
        count += 1;

        // await this.client.set(
        //   `@telemetryBoards:${typeTelemetry.id}`,
        //   `${telemetry.id}`,
        // );
      } catch (error) {
        logger.info(typeTelemetry.companyId);

        logger.info(error);
      }
    }

    this.ormProvider.clear();
  }

  async setMachineId(): Promise<void> {
    this.ormProvider.clear();
    const { telemetryBoards } = await this.telemetryBoardsRepository.find({
      filters: {},
    });

    for (const telemetry of telemetryBoards) {
      const machineId = (await this.client.get(
        `@machines:${telemetry.machineId}`,
      )) as string;

      const ownerId = (await this.client.get(
        `@users:${telemetry.ownerId}`,
      )) as string;

      telemetry.machineId = machineId;
      telemetry.ownerId = ownerId;

      this.telemetryBoardsRepository.save(telemetry);
    }

    await this.ormProvider.commit();
  }
}
