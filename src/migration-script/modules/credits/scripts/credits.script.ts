/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { inject, injectable } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import Redis from 'ioredis';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import TypeMachinesRepository from 'migration-script/modules/machines/typeorm/repositories/type-machines.repository';
import logger from '@config/logger';
import Type from '@modules/counter-types/contracts/enums/type';
import TypeCreditsRepository from '../typeorm/repositories/type-credits.repository';

@injectable()
class CreditsScript {
  private client = new Redis();

  constructor(
    @inject('TypeCreditsRepository')
    private typeCreditsRepository: TypeCreditsRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('TypeMachinesRepository')
    private typeMachinesRepository: TypeMachinesRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute(): Promise<void> {
    this.ormProvider.clear();
    const credits = await this.typeCreditsRepository.find();
    let count = 0;

    try {
      for (const credit of credits) {
        const telemetryBoardId = (await this.client.get(
          `@telemetryBoards:${credit.telemetryId}`,
        )) as string;

        const machine = await this.typeMachinesRepository.findOne(
          credit.telemetryId,
        );

        let groupId = 'null';

        if (machine) {
          groupId = (await this.client.get(
            `@groups:${machine.companyId}`,
          )) as string;
        }

        this.telemetryLogsRepository.create({
          date: credit.date,
          machineId: credit.machineId.toString(),
          maintenance: credit.isTest === 1,
          pin: credit.pin ? credit.pin.toString() : undefined,
          telemetryBoardId,
          type: Type.IN,
          value: Number(credit.value),
          pointOfSaleId: undefined,
          routeId: undefined,
          groupId,
          numberOfPlays: Number(credit.value / credit.gameValue),
        });
        count += 1;
        if (count % 30000 === 0) {
          await this.ormProvider.commit();
          this.ormProvider.clear();
          logger.info(count);
        }
      }
    } catch (error) {
      logger.error(error);

      await this.ormProvider.commit();
    }
  }

  async setMachineId(): Promise<void> {
    await this.ormProvider.clear();

    let count = 0;

    while (count < 1500000) {
      const { telemetryLogs } = await this.telemetryLogsRepository.find({
        filters: {},
        offset: count,
        limit: 10000,
      });

      for (const telemetryLog of telemetryLogs) {
        const machineId = (await this.client.get(
          `@machines:${telemetryLog.machineId}`,
        )) as string;

        telemetryLog.machineId = machineId;

        this.telemetryLogsRepository.save(telemetryLog);

        count += 1;
        if (count % 30000 === 0) {
          await this.ormProvider.commit();
          this.ormProvider.clear();
          logger.info(count);
        }
      }

      await this.ormProvider.commit();
    }
  }
}

export default CreditsScript;
