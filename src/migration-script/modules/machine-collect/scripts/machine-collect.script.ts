/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { inject, injectable } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import Redis from 'ioredis';
import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import CounterCollection from '@modules/collections/contracts/interfaces/counter-collection';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import AppError from '@shared/errors/app-error';
import logger from '@config/logger';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import BoxCollection from '@modules/collections/contracts/interfaces/box-collection';
import StorageProvider from '@providers/storage-provider/contracts/models/storage.provider';
import path from 'path';
import fs from 'fs';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import TypeMachineCollectRepository from '../typeorm/repositories/type-machine-collect-repository';

@injectable()
class MachineCollectScript {
  private client = new Redis();

  constructor(
    @inject('TypeMachineCollectRepository')
    private typeMachineCollectRepository: TypeMachineCollectRepository,

    @inject('CollectionsRepository')
    private collectionsRepository: CollectionsRepository,

    @inject('CounterTypesRepository')
    private counterTypesRepository: CounterTypesRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('StorageProvider')
    private storageProvider: StorageProvider,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute(): Promise<void> {
    this.ormProvider.clear();
    const machineCollects = await this.typeMachineCollectRepository.find();

    for (const machineCollect of machineCollects) {
      try {
        const machineId = (await this.client.get(
          `@machines:${machineCollect.machineId}`,
        )) as string;

        const machine = await this.machinesRepository.findOne({
          by: 'id',
          value: machineId,
        });
        // eslint-disable-next-line no-loop-func
        const countersCollect: any[] = [];

        let boxCollections: BoxCollection[] = [];
        for (const counter of machineCollect.counters) {
          const counterId = (await this.client.get(
            `@counters:@machineId:${machineCollect.machineId}:@counterId:${counter.counterId}`,
          )) as string;

          let counterTypeId: string | undefined;

          machine?.boxes.forEach(box => {
            if (counterTypeId === undefined) {
              counterTypeId = box.counters.find(
                counter => counter.id === counterId,
              )?.counterTypeId;
            }
          });

          if (!counterTypeId) {
            machine?.boxes.forEach(box => {
              logger.info(box.counters);
            });
          }

          const counterTypeLabel = (
            await this.counterTypesRepository.findOne({
              id: counterTypeId,
            })
          )?.label;

          if (!counterTypeLabel) throw AppError.counterTypeNotFound;

          const counterCollection: CounterCollection = {
            counterId,
            counterTypeLabel,
            digitalCount: counter.isDigital ? counter.quantity : 0,
            mechanicalCount: counter.isMechanical ? counter.quantity : 0,
            userCount: counter.isCounted ? counter.quantity : 0,
            photos: counter.photos.map(photo => {
              return { key: photo.photo, downloadUrl: photo.photo };
            }),
            telemetryCount: 0,
          };

          const counterGroup = (await this.client.get(
            `@boxes:@machineId:${machineCollect.machineId}:@counterId:${counter.counterId}`,
          )) as string;

          const boxId = (await this.client.get(
            `@boxes:${counterGroup}`,
          )) as string;

          countersCollect.push({
            boxId,
            counterCollection,
          });

          const boxesIds = [
            ...new Set(
              countersCollect.map(counterCollect => counterCollect.boxId),
            ),
          ];

          boxCollections = boxesIds.map(boxId => {
            const temp: CounterCollection[] = countersCollect
              .filter(counterCollect => counterCollect.boxId === boxId)
              .map(cc => {
                return {
                  counterId: cc.counterCollection.counterId,
                  counterTypeLabel: cc.counterCollection.counterTypeLabel,
                  digitalCount: cc.counterCollection.digitalCount,
                  mechanicalCount: cc.counterCollection.mechanicalCount,
                  photos: [...cc.counterCollection.photos],
                  telemetryCount: cc.counterCollection.telemetryCount,
                  userCount: cc.counterCollection.userCount,
                };
              });

            const counterCollections: CounterCollection[] = [];

            temp.forEach(cc => {
              if (
                counterCollections.find(cc2 => cc.counterId === cc2.counterId)
              ) {
                const ccIndex = counterCollections.findIndex(
                  cc2 => cc.counterId === cc2.counterId,
                );
                counterCollections[ccIndex].photos = [
                  ...counterCollections[ccIndex].photos,
                  ...cc.photos,
                ];

                counterCollections[ccIndex].digitalCount += cc.digitalCount;
                counterCollections[ccIndex].mechanicalCount +=
                  cc.mechanicalCount;

                if (counterCollections[ccIndex]?.userCount) {
                  if (cc.userCount) {
                    const troxa = counterCollections[ccIndex].userCount || 0;
                    counterCollections[ccIndex].userCount =
                      troxa + cc.userCount;
                  }
                } else {
                  counterCollections[ccIndex].userCount = cc.userCount;
                }
              } else {
                counterCollections.push(cc);
              }
            });

            return {
              boxId,
              counterCollections,
            };
          });
        }
        const userId = (await this.client.get(
          `@users:${machineCollect.userId}`,
        )) as string;

        for (const boxCollection of boxCollections) {
          for (const counterCollection of boxCollection.counterCollections) {
            for (const photo1 of counterCollection.photos) {
              const filePath = path.join(
                process.cwd(),
                'optimized',
                photo1.key,
              );

              logger.info(filePath);

              const f = fs.readFileSync(filePath);

              const photo = await this.storageProvider.uploadFile(f);

              const index = counterCollection.photos.findIndex(
                ccc => ccc.key === photo1.key,
              );
              counterCollection.photos[index] = photo;
            }
          }
        }

        if (machine?.groupId) {
          const collection = this.collectionsRepository.create({
            boxCollections,
            groupId: machine?.groupId,
            machineId,
            observations: '',
            pointOfSaleId: undefined,
            startTime: machineCollect.collectionDate,
            date: machineCollect.collectionDate,
            userId,
            previousCollectionId: machineCollect.previousCollectionId?.toString(),
          });

          this.collectionsRepository.save(collection);
          await this.ormProvider.commit();
          await this.client.set(
            `@collections:${machineCollect.id}`,
            collection.id,
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async setPreviousCollection(): Promise<void> {
    this.ormProvider.clear();
    const { collections } = await this.collectionsRepository.find({});

    for (const collection of collections) {
      const previousCollectionId = await this.client.get(
        `@collections:${collection.previousCollectionId}`,
      );

      collection.previousCollectionId = previousCollectionId || undefined;

      logger.info(previousCollectionId);

      let previousCollection;
      if (previousCollectionId) {
        previousCollection = await this.collectionsRepository.findOne(
          previousCollectionId,
        );
      }

      const telemetryLogsIn = await this.telemetryLogsRepository.find({
        filters: {
          date: {
            startDate: previousCollection?.date,
            endDate: collection.date,
          },
          machineId: collection.machineId,
          maintenance: false,
          type: 'IN',
        },
      });

      const telemetryLogsOut = await this.telemetryLogsRepository.find({
        filters: {
          date: {
            startDate: previousCollection?.date,
            endDate: collection.date,
          },
          machineId: collection.machineId,
          maintenance: false,
          type: 'OUT',
        },
      });

      const machine = await this.machinesRepository.findOne({
        by: 'id',
        value: collection.machineId,
      });

      for (const bb of collection.boxCollections) {
        for (const cc of bb.counterCollections) {
          let pin: string | undefined;
          let counterTypeId;
          machine?.boxes.forEach(box =>
            box.counters.forEach(counter => {
              if (counter.id === cc.counterId) {
                pin = counter.pin;
                counterTypeId = counter.counterTypeId;
              }
            }),
          );

          const counterType = await this.counterTypesRepository.findOne({
            id: counterTypeId,
          });

          if (counterType?.type === 'IN') {
            const telemetryCount = telemetryLogsIn
              .filter(
                telemetryLog =>
                  telemetryLog.pin?.toString() === pin?.split(' ')[1],
              )
              .reduce((a, b) => a + b.value, 0);

            const ccIndex = bb.counterCollections.findIndex(
              cc2 => cc.counterId === cc2.counterId,
            );

            bb.counterCollections[ccIndex].telemetryCount = telemetryCount;
          }

          if (counterType?.type === 'OUT') {
            const telemetryCount = telemetryLogsOut
              .filter(
                telemetryLog =>
                  telemetryLog.pin?.toString() === pin?.split(' ')[1],
              )
              .reduce((a, b) => a + b.value, 0);

            const ccIndex = bb.counterCollections.findIndex(
              cc2 => cc.counterId === cc2.counterId,
            );

            bb.counterCollections[ccIndex].telemetryCount = telemetryCount;
          }
        }
      }

      this.collectionsRepository.save(collection);
      await this.ormProvider.commit();
      await this.ormProvider.clear();
    }
  }
}

export default MachineCollectScript;
