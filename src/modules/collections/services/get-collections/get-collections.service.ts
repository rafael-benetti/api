import logger from '@config/logger';
import Collection from '@modules/collections/contracts/entities/collection';
import CollectionsRepository from '@modules/collections/contracts/repositories/collections.repository';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  machineSerialNumber?: string;
  routeId?: string;
  operatorId?: string;
  limit?: number;
  offset?: number;
}

interface Response {
  collections: Collection[];
  count: number;
}

@injectable()
export default class GetCollectionsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('CollectionsRepository')
    private collectionsRepository: CollectionsRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,
  ) {}

  async execute({
    userId,
    machineSerialNumber,
    routeId,
    operatorId,
    limit,
    offset,
  }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const groupIds = await getGroupUniverse(user);

    const machines = await this.machinesRepository.find({
      serialNumber: machineSerialNumber,
      groupIds,
    });

    const machineIds = machines.map(machine => machine.id);
    logger.info(machineSerialNumber);
    logger.info(routeId);
    logger.info(operatorId);
    logger.info(machineIds);

    const { collections, count } = await this.collectionsRepository.find({
      groupIds,
      machineId: machineIds,
      userId: user.role === Role.OPERATOR ? user.id : operatorId,
      routeId,
      limit,
      offset,
    });

    collections.forEach(collection => {
      collection.machine = machines.find(
        machine => machine.id === collection.machineId,
      );

      if (!collection.pointOfSaleId)
        collection.pointOfSale = {
          label: '',
        };
    });

    return {
      collections,
      count,
    };
  }
}
