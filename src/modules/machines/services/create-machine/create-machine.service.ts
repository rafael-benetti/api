import CategoriesRepository from '@modules/categories/contracts/repositories/categories.repository';
import Box from '@modules/machines/contracts/models/box';
import Counter from '@modules/machines/contracts/models/counter';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';

interface Request {
  userId: string;
  categoryId: string;
  boxes: Box[];
  telemetryBoardId?: number;
  groupId: string;
  serialNumber: string;
  gameValue: number;
  operatorId: string;
  locationId: string;
  typeOfPrizeId: string;
  minimumPrizeCount: number;
}

@injectable()
class CreateMachineService {
  constructor(
    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,

    @inject('CategoriesRepository')
    private categoriesRepository: CategoriesRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('CounterTypesRepository')
    private counterTypesRepository: CounterTypesRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('TelemetryBoardsRepository')
    private telemetryBoardsRepository: TelemetryBoardsRepository,
  ) {}

  public async execute({
    userId,
    categoryId,
    boxes,
    gameValue,
    groupId,
    locationId,
    operatorId,
    serialNumber,
    telemetryBoardId,
    typeOfPrizeId,
    minimumPrizeCount,
  }: Request): Promise<Machine> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && user.role !== Role.MANAGER)
      throw AppError.authorizationError;

    const checkMachineExists = await this.machinesRepository.findOne({
      by: 'serialNumber',
      value: serialNumber,
    });

    if (checkMachineExists) throw AppError.serialNumberAlreadyUsed;

    if (user.role === Role.MANAGER) {
      if (!user.permissions?.createMachines) throw AppError.authorizationError;
      if (!user.groupIds?.includes(groupId)) throw AppError.authorizationError;
    }

    if (user.role === Role.OWNER) {
      const groups = await this.groupsRepository.find({
        filters: {
          ownerId: user.id,
        },
      });

      const groupIds = groups.map(group => group.id);

      if (!groupIds.includes(groupId)) throw AppError.authorizationError;
    }

    const ownerId = user.role === Role.OWNER ? user.id : user.ownerId;

    if (!ownerId) throw AppError.unknownError;

    const boxesEntities = boxes.map(box => {
      const counters = box.counters.map(counter => new Counter(counter));
      return new Box({ counters });
    });

    const counterTypeIds = [
      ...new Set(
        boxesEntities.flatMap(boxe =>
          boxe.counters.map(counter => counter.counterTypeId),
        ),
      ),
    ];

    const counterTypes = await this.counterTypesRepository.find({
      id: counterTypeIds,
    });

    if (counterTypeIds.length !== counterTypes.length)
      throw AppError.authorizationError;

    const category = await this.categoriesRepository.findOne({
      by: 'id',
      value: categoryId,
    });

    if (!category) throw AppError.machineCategoryNotFound;

    if (locationId) {
      const pointOfSale = await this.pointsOfSaleRepository.findOne({
        by: 'id',
        value: locationId,
      });

      if (pointOfSale?.groupId !== groupId) throw AppError.authorizationError;
    }

    if (operatorId) {
      const operator = await this.usersRepository.findOne({
        by: 'id',
        value: operatorId,
      });

      if (!operator?.groupIds?.includes(groupId))
        throw AppError.authorizationError;
    }

    let typeOfPrize: { id: string; label: string } | undefined;
    if (typeOfPrizeId) {
      let prize = user.stock?.prizes?.find(prize => prize.id === typeOfPrizeId);

      if (!prize) {
        const group = await this.groupsRepository.findOne({
          by: 'id',
          value: groupId,
        });

        prize = group?.stock.prizes.find(prize => prize.id === typeOfPrizeId);
      }

      if (!prize) throw AppError.productNotFound;

      typeOfPrize = {
        id: prize.id,
        label: prize.label,
      };
    }

    const machine = this.machinesRepository.create({
      boxes: boxesEntities,
      categoryId: category.id,
      gameValue,
      groupId,
      locationId,
      operatorId,
      ownerId,
      serialNumber,
      categoryLabel: category.label,
      isActive: true,
      telemetryBoardId,
      typeOfPrize,
      minimumPrizeCount,
    });

    if (telemetryBoardId) {
      const telemetryBoard = await this.telemetryBoardsRepository.findById(
        telemetryBoardId,
      );

      if (!telemetryBoard) throw AppError.telemetryBoardNotFound;

      if (
        user.role === Role.MANAGER &&
        !user.groupIds?.includes(telemetryBoard.groupId)
      )
        throw AppError.authorizationError;

      if (user.role === Role.OWNER && telemetryBoard.ownerId !== user.id)
        throw AppError.authorizationError;

      telemetryBoard.machineId = machine.id;

      this.telemetryBoardsRepository.save(telemetryBoard);
    }

    await this.ormProvider.commit();

    return machine;
  }
}
export default CreateMachineService;
