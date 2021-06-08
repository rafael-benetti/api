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
import TypeGiftsRepository from '../typeorm/repositories/type-gifts.respository';

@injectable()
class GiftsScript {
  private client = new Redis();

  constructor(
    @inject('TypeGiftsRepository')
    private typeGiftsRepository: TypeGiftsRepository,

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
    logger.info('começou');
    const gifts = await this.typeGiftsRepository.find();
    let count = 0;
    logger.info(count);
    const { machines } = await this.machinesRepository.find({});

    try {
      for (const gift of gifts) {
        const telemetryBoardId = (await this.client.get(
          `@telemetryBoards:${gift.telemetryId}`,
        )) as string;

        const machineId = (await this.client.get(
          `@machines:${gift.machineId}`,
        )) as string;

        this.telemetryLogsRepository.create({
          date: gift.date,
          machineId,
          maintenance: false,
          pin: gift.pin ? gift.pin.toString() : undefined,
          telemetryBoardId,
          type: Type.OUT,
          value: gift.value,
          pointOfSaleId: undefined,
          routeId: undefined,
          groupId:
            machines.find(machine => machine.id === machineId)?.groupId || '',
        });
        count += 1;
        if (count % 20000 === 0) {
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

export default GiftsScript;
