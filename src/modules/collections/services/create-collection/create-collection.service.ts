/* eslint-disable @typescript-eslint/no-explicit-any */
import Collection from '@modules/collections/contracts/entities/collection';
import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
import TelemetryLogsRepository from '@modules/telemetry-logs/contracts/repositories/telemetry-logs.repository';
import Role from '@modules/users/contracts/enums/role';
import Photo from '@modules/users/contracts/models/photo';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import StorageProvider from '@providers/storage-provider/contracts/models/storage.provider';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import isInGroupUniverse from '@shared/utils/is-in-group-universe';
import { isBefore, subMinutes } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import Geolocation from '../../contracts/dtos/geolocation.dto';

interface Request {
  userId: string;
  machineId: string;
  observations: string;
  startTime: Date;
  startLocation?: Geolocation;
  endLocation?: Geolocation;
  boxCollections: {
    boxId: string;
    prizeCount?: number;
    counterCollections: {
      counterId: string;
      counterTypeLabel: string;
      mechanicalCount: number;
      digitalCount: number;
      userCount: number;
      telemetryCount: number;
      photos: Photo[];
    }[];
  }[];
  files?: any[];
}

@injectable()
class CreateCollectionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('RoutesRepository')
    private routesRepository: RoutesRepository,

    @inject('StorageProvider')
    private storageProvider: StorageProvider,

    @inject('TelemetryLogsRepository')
    private telemetryLogsRepository: TelemetryLogsRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('CollectionsRepository')
    private collectionsRepository: CollectionsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    machineId,
    observations,
    boxCollections,
    files,
    startTime,
    endLocation,
    startLocation,
  }: Request): Promise<Collection> {
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

    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const machine = await this.machinesRepository.findOne({
      by: 'id',
      value: machineId,
    });

    if (!machine) throw AppError.machineNotFound;

    if (!machine.telemetryBoardId) throw AppError.telemetryBoardNotFound;

    if (!machine.lastConnection) throw AppError.thisMachineIsOffline;

    if (isBefore(machine.lastConnection, subMinutes(new Date(Date.now()), 10)))
      throw AppError.thisMachineIsOffline;

    if (!machine.locationId) throw AppError.productInStock;

    const location = await this.pointsOfSaleRepository.findOne({
      by: 'id',
      value: machine.locationId,
    });

    if (!location) throw AppError.productInStock;

    if (user.role === Role.OPERATOR && machine.operatorId !== user.id)
      throw AppError.authorizationError;

    const universe = await getGroupUniverse(user);
    if (
      !isInGroupUniverse({
        universe,
        groups: [machine.groupId],
        method: 'INTERSECTION',
      })
    )
      throw AppError.authorizationError;

    const route = await this.routesRepository.findOne({
      pointsOfSaleId: machine.locationId,
    });

    const previousCollection = await this.collectionsRepository.findLastCollection(
      machineId,
    );

    const telemetryLogs = await this.telemetryLogsRepository.find({
      filters: {
        date: {
          startDate: previousCollection?.date,
          endDate: new Date(),
        },
        machineId,
        maintenance: false,
      },
    });

    await Promise.all(
      boxCollections.map(async boxCollection => {
        const box = machine.boxes.find(box => box.id === boxCollection.boxId);

        if (!box) throw AppError.boxNotFound;

        if (
          boxCollection.prizeCount !== undefined &&
          (user.role === Role.OWNER || user.permissions?.fixMachineStock)
        ) {
          box.numberOfPrizes = boxCollection.prizeCount;
        }

        box.currentMoney = 0;

        await Promise.all(
          boxCollection.counterCollections.map(async counterCollection => {
            const counter = box.counters.find(
              counter => counter.id === counterCollection.counterId,
            );

            if (!counter) throw AppError.counterNotFound;

            counterCollection.telemetryCount = telemetryLogs
              .filter(
                telemetryLog =>
                  telemetryLog.pin?.toString() ===
                  counter.pin?.split(' ')[1].toString(),
              )
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

    const collection = this.collectionsRepository.create({
      previousCollectionId: previousCollection?.id,
      machineId,
      groupId: machine.groupId,
      userId,
      pointOfSaleId: machine.locationId,
      routeId: route?.id,
      observations,
      boxCollections,
      startTime,
      endLocation,
      startLocation,
    });

    machine.lastCollection = collection.date;

    this.collectionsRepository.save(collection);
    this.machinesRepository.save(machine);

    await this.ormProvider.commit();

    Object.assign(collection, {
      machine,
      user,
      pointOfSale: location,
      previousCollection,
    });

    return collection;
  }
}

export default CreateCollectionService;
