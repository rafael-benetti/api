import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import Type from '@modules/counter-types/contracts/enums/type';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import Machine from '@modules/machines/contracts/models/machine';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import { differenceInDays, endOfDay, startOfDay } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import ExcelJS from 'exceljs';
import logger from '@config/logger';
import exportCollectionsReport from './export-collections-report';

interface Request {
  userId: string;
  startDate: Date;
  endDate: Date;
  pointOfSaleId: string;
  download: boolean;
}

interface Response {
  serialNumber: string;
  initialDate: Date;
  finalDate: Date;
  initialMechanicalCountIn: number;
  finalMechanicalCountIn: number;
  mechanicalDiffenceIn: number;
  initialMechanicalCountOut: number;
  finalMechanicalCountOut: number;
  mechanicalDiffenceOut: number;
  initialDigitalCountIn: number;
  finalDigitalCountIn: number;
  digitalDiffenceIn: number;
  initialDigitalCountOut: number;
  finalDigitalCountOut: number;
  digitalDiffenceOut: number;
  numberOfDays: number;
  userCount: number;
}

@injectable()
export default class GenerateCollectionsReportService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('CollectionsRepository')
    private collectionsRepository: CollectionsRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('CounterTypesRepository')
    private counterTypesRepository: CounterTypesRepository,
  ) {}

  async execute({
    userId,
    pointOfSaleId,
    startDate,
    endDate,
    download,
  }: Request): Promise<Response[] | ExcelJS.Workbook> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && !user.permissions?.generateReports)
      throw AppError.authorizationError;

    const pointOfSale = await this.pointsOfSaleRepository.findOne({
      by: 'id',
      value: pointOfSaleId,
    });

    if (!pointOfSale) throw AppError.pointOfSaleNotFound;

    const groupIds = await getGroupUniverse(user);

    if (!groupIds.includes(pointOfSale.groupId))
      throw AppError.authorizationError;

    startDate = startOfDay(startDate);
    endDate = endOfDay(endDate);

    const { collections } = await this.collectionsRepository.find({
      pointOfSaleId,
      startDate,
      endDate,
    });

    logger.info(collections);

    const machines = [
      ...new Set(collections.map(collection => collection.machine)),
    ] as Machine[];

    const counterTypes = await this.counterTypesRepository.find({
      ownerId: user.role === Role.OWNER ? user.id : user.ownerId,
    });

    const machineReport = machines.map(machine => {
      const machineCollections = collections.filter(
        collection => collection.machineId === machine.id,
      );

      const initialMechanicalCountIn = machineCollections[
        machineCollections.length - 1
      ].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(
                counterType => counterType.label === b.counterTypeLabel,
              )?.type === Type.IN
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : a + 0,
            0,
          ),
        )
        .reduce((a, b) => a + b, 0);

      const finalMechanicalCountIn = machineCollections[0].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(
                counterType => counterType.label === b.counterTypeLabel,
              )?.type === Type.IN
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : a + 0,
            0,
          ),
        )
        .reduce((a, b) => a + b, 0);

      const mechanicalDiffenceIn =
        finalMechanicalCountIn - initialMechanicalCountIn;

      const initialMechanicalCountOut = machineCollections[
        machineCollections.length - 1
      ].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(
                counterType => counterType.label === b.counterTypeLabel,
              )?.type === Type.OUT
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : a + 0,
            0,
          ),
        )
        .reduce((a, b) => a + b, 0);

      const finalMechanicalCountOut = machineCollections[0].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(
                counterType => counterType.label === b.counterTypeLabel,
              )?.type === Type.OUT
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : a + 0,
            0,
          ),
        )
        .reduce((a, b) => a + b, 0);

      const mechanicalDiffenceOut =
        finalMechanicalCountOut - initialMechanicalCountOut;

      const initialDigitalCountIn = machineCollections[
        machineCollections.length - 1
      ].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(
                counterType => counterType.label === b.counterTypeLabel,
              )?.type === Type.IN
                ? a + (b.digitalCount ? b.digitalCount : 0)
                : a + 0,
            0,
          ),
        )
        .reduce((a, b) => a + b, 0);

      const finalDigitalCountIn = machineCollections[0].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(
                counterType => counterType.label === b.counterTypeLabel,
              )?.type === Type.IN
                ? a + (b.digitalCount ? b.digitalCount : 0)
                : a + 0,
            0,
          ),
        )
        .reduce((a, b) => a + b, 0);

      const digitalDiffenceIn = finalDigitalCountIn - initialDigitalCountIn;

      const initialDigitalCountOut = machineCollections[
        machineCollections.length - 1
      ].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(
                counterType => counterType.label === b.counterTypeLabel,
              )?.type === Type.OUT
                ? a + (b.digitalCount ? b.digitalCount : 0)
                : a + 0,
            0,
          ),
        )
        .reduce((a, b) => a + b, 0);

      const finalDigitalCountOut = machineCollections[0].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(
                counterType => counterType.label === b.counterTypeLabel,
              )?.type === Type.OUT
                ? a + (b.digitalCount ? b.digitalCount : 0)
                : a + 0,
            0,
          ),
        )
        .reduce((a, b) => a + b, 0);

      const userCount = machineCollections
        .map(machineCollection =>
          machineCollection.boxCollections
            .map(boxCollection =>
              boxCollection.counterCollections.reduce(
                (a, b) =>
                  counterTypes.find(
                    counterType => counterType.label === b.counterTypeLabel,
                  )?.type === Type.IN
                    ? a + (b.userCount ? b.userCount : 0)
                    : a + 0,
                0,
              ),
            )
            .reduce((a, b) => a + b, 0),
        )
        .reduce((a, b) => a + b, 0);

      const digitalDiffenceOut = finalDigitalCountOut - initialDigitalCountOut;

      const initialDate =
        machineCollections[machineCollections.length - 1].date;
      const finalDate = machineCollections[0].date;

      const numberOfDays = differenceInDays(finalDate, initialDate);

      return {
        serialNumber: machine.serialNumber,
        initialDate,
        finalDate,
        initialMechanicalCountIn,
        finalMechanicalCountIn,
        mechanicalDiffenceIn,
        initialMechanicalCountOut,
        finalMechanicalCountOut,
        mechanicalDiffenceOut,
        initialDigitalCountIn,
        finalDigitalCountIn,
        digitalDiffenceIn,
        initialDigitalCountOut,
        finalDigitalCountOut,
        digitalDiffenceOut,
        numberOfDays,
        userCount,
      };
    });

    if (download) {
      const Workbook = await exportCollectionsReport({
        pointOfSale,
        collectionsAnalytics: machineReport,
        date: {
          startDate,
          endDate,
        },
      });

      return Workbook;
    }

    return machineReport;
  }
}
