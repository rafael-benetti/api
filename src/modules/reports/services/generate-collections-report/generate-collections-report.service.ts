import logger from '@config/logger';
import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import Type from '@modules/counter-types/contracts/enums/type';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import Machine from '@modules/machines/contracts/models/machine';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import { differenceInDays } from 'date-fns';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  startDate: Date;
  endDate: Date;
  pointOfSaleId: string;
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
  }: Request): Promise<void> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && user.permissions?.generateReports)
      throw AppError.authorizationError;

    const pointOfSale = await this.pointsOfSaleRepository.findOne({
      by: 'id',
      value: pointOfSaleId,
    });

    if (!pointOfSale) throw AppError.pointOfSaleNotFound;

    const groupIds = await getGroupUniverse(user);

    if (!groupIds.includes(pointOfSale?.groupId))
      throw AppError.authorizationError;

    const { collections } = await this.collectionsRepository.find({
      pointOfSaleId,
      startDate,
      endDate,
    });

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

      const initialMechanicalCountIn = machineCollections[0].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(counterType => counterType.id === b.counterId)
                ?.type === Type.IN
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : 0,
            0,
          ),
        )
        .reduce((a, b) => a + b);

      const finalMechanicalCountIn = machineCollections[0].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(counterType => counterType.id === b.counterId)
                ?.type === Type.IN
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : 0,
            0,
          ),
        )
        .reduce((a, b) => a + b);

      const mechanicalDiffenceIn =
        finalMechanicalCountIn - initialMechanicalCountIn;

      const initialMechanicalCountOut = machineCollections[0].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(
                counterType => counterType.label === b.counterTypeLabel,
              )?.type === Type.OUT
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : 0,
            0,
          ),
        )
        .reduce((a, b) => a + b);

      const finalMechanicalCountOut = machineCollections[0].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(
                counterType => counterType.label === b.counterTypeLabel,
              )?.type === Type.OUT
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : 0,
            0,
          ),
        )
        .reduce((a, b) => a + b);

      const mechanicalDiffenceOut =
        finalMechanicalCountOut - initialMechanicalCountOut;

      const initialDigitalCountIn = machineCollections[0].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(counterType => counterType.id === b.counterId)
                ?.type === Type.IN
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : 0,
            0,
          ),
        )
        .reduce((a, b) => a + b);

      const finalDigitalCountIn = machineCollections[0].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(counterType => counterType.id === b.counterId)
                ?.type === Type.IN
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : 0,
            0,
          ),
        )
        .reduce((a, b) => a + b);

      const digitalDiffenceIn = finalDigitalCountIn - initialDigitalCountIn;

      const initialDigitalCountOut = machineCollections[0].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(
                counterType => counterType.label === b.counterTypeLabel,
              )?.type === Type.OUT
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : 0,
            0,
          ),
        )
        .reduce((a, b) => a + b);

      const finalDigitalCountOut = machineCollections[0].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) =>
              counterTypes.find(
                counterType => counterType.label === b.counterTypeLabel,
              )?.type === Type.OUT
                ? a + (b.mechanicalCount ? b.mechanicalCount : 0)
                : 0,
            0,
          ),
        )
        .reduce((a, b) => a + b);

      machineCollections.forEach(machineCollection =>
        machineCollection.boxCollections.forEach(boxCollection =>
          logger.info(boxCollection),
        ),
      );

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
                    : 0,
                0,
              ),
            )
            .reduce((a, b) => a + b),
        )
        .reduce((a, b) => a + b);

      const digitalDiffenceOut = finalDigitalCountOut - initialDigitalCountOut;

      const initialDate = machineCollections[0].date;
      const finalDate = machineCollections[machineCollections.length - 1].date;

      const numberOfDays = differenceInDays(initialDate, finalDate);

      logger.info({
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
      });

      return {
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
  }
}
