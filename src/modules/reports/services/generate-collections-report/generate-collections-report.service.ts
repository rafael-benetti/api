import logger from '@config/logger';
import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import Machine from '@modules/machines/contracts/models/machine';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
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

    const machineReport = machines.map(machine => {
      const machineCollections = collections.filter(
        collection => collection.machineId === machine.id,
      );

      const initialMechanicalCount = machineCollections[0].boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) => (a + b.mechanicalCount ? b.mechanicalCount : 0),
            0,
          ),
        )
        .reduce((a, b) => a + b);

      const finalMechanicalCount = machineCollections[
        machineCollections.length - 1
      ]?.boxCollections
        .map(boxCollection =>
          boxCollection.counterCollections.reduce(
            (a, b) => (a + b.mechanicalCount ? b.mechanicalCount : 0),
            0,
          ),
        )
        .reduce((a, b) => a + b);

      return {
        initialMechanicalCount,
        finalMechanicalCount,
        difference: finalMechanicalCount - initialMechanicalCount,
      };
    });
  }
}
