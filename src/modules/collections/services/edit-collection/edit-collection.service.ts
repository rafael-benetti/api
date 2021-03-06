/* eslint-disable @typescript-eslint/no-explicit-any */
import Collection from '@modules/collections/contracts/entities/collection';
import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import Photo from '@modules/users/contracts/models/photo';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import StorageProvider from '@providers/storage-provider/contracts/models/storage.provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import LogsRepository from '@modules/logs/contracts/repositories/logs-repository';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import LogType from '@modules/logs/contracts/enums/log-type.enum';

interface Request {
  userId: string;
  collectionId: string;
  photosToDelete?: string[];
  machineId: string;
  files?: any[];
  observations: string;
  boxCollections: {
    boxId: string;
    counterCollections: {
      counterTypeLabel: string;
      counterId: string;
      mechanicalCount: number;
      digitalCount: number;
      userCount: number;
      telemetryCount: number;
      photos: Photo[];
    }[];
  }[];
}

@injectable()
class EditCollectionService {
  constructor(
    @inject('CollectionsRepository')
    private collectionsRepository: CollectionsRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,

    @inject('LogsRepository')
    private logsRepository: LogsRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('StorageProvider')
    private storageProvider: StorageProvider,
  ) {}

  public async execute({
    userId,
    collectionId,
    machineId,
    files,
    photosToDelete,
    boxCollections,
    observations,
  }: Request): Promise<Collection> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;
    if (
      user.role !== Role.MANAGER &&
      user.role !== Role.OWNER &&
      user.role !== Role.OPERATOR
    )
      throw AppError.authorizationError;

    if (user.role === Role.OPERATOR) {
      if (!user.permissions?.editCollections) throw AppError.authorizationError;
    }

    const lastCollection = await this.collectionsRepository.findLastCollection(
      machineId,
    );

    if (!lastCollection) throw AppError.collectionNotFound;

    if (lastCollection.id !== collectionId)
      throw AppError.thisIsNotLastCollection;

    const machine = await this.machinesRepository.findOne({
      by: 'id',
      value: machineId,
    });

    if (!machine) throw AppError.machineNotFound;
    if (!machine.locationId) throw AppError.machineInStock;

    const location = await this.pointsOfSaleRepository.findOne({
      by: 'id',
      value: machine.locationId,
    });

    if (!location) throw AppError.pointOfSaleNotFound;

    if (user.role === Role.OPERATOR && machine.operatorId !== user.id)
      throw AppError.authorizationError;

    if (
      !user.groupIds?.includes(lastCollection.groupId) &&
      user.role !== Role.OWNER
    )
      throw AppError.authorizationError;

    const parsedFiles: {
      [key: string]: {
        [key: string]: any[];
      };
    } = {};

    files?.forEach(file => {
      const [boxId, counterId] = file.fieldname.split(':');

      if (!boxId || !counterId) throw AppError.incorrectFilters;

      if (!parsedFiles[boxId]) parsedFiles[boxId] = {};
      if (!parsedFiles[boxId][counterId]) parsedFiles[boxId][counterId] = [];
      parsedFiles[boxId][counterId].push(file);
    });

    // ? REMOVE FOTOS
    if (photosToDelete && photosToDelete.length > 0) {
      lastCollection.boxCollections.forEach(boxCollections => {
        boxCollections.counterCollections.forEach(counterCollection => {
          for (let i = 0; i < counterCollection.photos?.length; i += 1) {
            const obj = counterCollection.photos[i];

            if (photosToDelete.indexOf(obj.key) !== -1) {
              counterCollection.photos.splice(i, 1);
              this.storageProvider.deleteFile(obj.key);
              i -= 1;
            }
          }
        });
      });
    }

    let previousCollection;

    if (lastCollection.previousCollectionId)
      previousCollection = await this.collectionsRepository.findOne(
        lastCollection.previousCollectionId,
      );

    const telemetryLogs = await this.telemetryLogsRepository.find({
      filters: {
        date: {
          startDate: previousCollection?.date,
          endDate: lastCollection.date,
        },
        machineId,
        maintenance: false,
        type: 'IN',
      },
    });

    await Promise.all(
      boxCollections.map(async boxCollection => {
        const box = machine.boxes.find(box => box.id === boxCollection.boxId);

        if (!box) throw AppError.boxNotFound;

        await Promise.all(
          boxCollection.counterCollections.map(async counterCollection => {
            const counter = box.counters.find(
              counter => counter.id === counterCollection.counterId,
            );

            if (!counter) throw AppError.counterNotFound;

            counterCollection.telemetryCount = telemetryLogs
              .map(log => log.value)
              .reduce((a, b) => a + b, 0);

            if (files && files.length > 0) {
              if (parsedFiles[box.id] && parsedFiles[box.id][counter.id])
                await Promise.all(
                  parsedFiles[box.id][counter.id].map(async file => {
                    const photo = await this.storageProvider.uploadFile(file);

                    if (!counterCollection.photos)
                      counterCollection.photos = [];

                    counterCollection.photos.push(photo);
                  }),
                );
            }
          }),
        );
      }),
    );

    lastCollection.boxCollections.forEach(lastBoxCollection => {
      lastBoxCollection.counterCollections.forEach(lastCounterCollection => {
        boxCollections.forEach(boxCollection => {
          if (boxCollection.boxId === lastBoxCollection.boxId) {
            boxCollection.counterCollections.forEach(counterCollection => {
              if (
                counterCollection.counterId === lastCounterCollection.counterId
              ) {
                counterCollection.photos = [
                  ...(counterCollection.photos ?? []),
                  ...(lastCounterCollection.photos ?? []),
                ];
              }
            });
          }
        });
      });
    });

    lastCollection.boxCollections = boxCollections;
    lastCollection.observations = observations;

    this.machinesRepository.save(machine);
    await this.ormProvider.commit();

    this.collectionsRepository.save(lastCollection);

    const group = await this.groupsRepository.findOne({
      by: 'id',
      value: lastCollection.groupId,
    });

    if (!group) throw AppError.groupNotFound;

    this.logsRepository.create({
      createdBy: user.id,
      groupId: lastCollection.groupId,
      ownerId: group.ownerId,
      type: LogType.EDIT_COLLECTION,
      machineId: machine.id,
      collectionId: lastCollection.id,
    });

    await this.ormProvider.commit();

    Object.assign(lastCollection, {
      machine,
      user,
      pointOfSale: location,
      previousCollection,
    });

    return lastCollection;
  }
}
export default EditCollectionService;
