/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { inject, injectable } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import Redis from 'ioredis';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import TypeMachinesRepository from 'migration-script/modules/machines/typeorm/repositories/type-machines.repository';
import logger from '@config/logger';
import Type from '@modules/counter-types/contracts/enums/type';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
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

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute(): Promise<void> {
    this.ormProvider.clear();
    const credits = await this.typeCreditsRepository.find();
    let count = 0;

    const { machines } = await this.machinesRepository.find({});

    try {
      for (const credit of credits) {
        const telemetryBoardId = (await this.client.get(
          `@telemetryBoards:${credit.telemetryId}`,
        )) as string;

        const machineId = (await this.client.get(
          `@machines:${credit.machineId}`,
        )) as string;

        this.telemetryLogsRepository.create({
          date: credit.date,
          machineId,
          maintenance: credit.isTest === 1,
          pin: credit.pin ? credit.pin.toString() : undefined,
          telemetryBoardId,
          type: Type.IN,
          value: Number(credit.value),
          pointOfSaleId: undefined,
          routeId: undefined,
          groupId:
            machines.find(machine => machine.id === machineId)?.groupId || '',
          numberOfPlays:
            Number(credit.value / credit.gameValue) < 1
              ? 1
              : Math.trunc(Number(credit.value / credit.gameValue)),
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
    }

    await this.ormProvider.commit();
  }
}

export default CreditsScript;
