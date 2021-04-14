import CategoriesRepository from '@modules/categories/contracts/repositories/categories.repository';
import Box from '@modules/machines/contracts/models/box';
import Counter from '@modules/machines/contracts/models/counter';
import Machine from '@modules/machines/contracts/models/machine';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import PointsOfSaleRepository from '@modules/points-of-sale/contracts/repositories/points-of-sale.repository';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import RoutesRepository from '@modules/routes/contracts/repositories/routes.repository';
import TelemetryBoardsRepository from '@modules/telemetry/contracts/repositories/telemetry-boards.repository';

interface Request {
  userId: string;
  machineId: string;
  boxes: Box[];
  gameValue: number;
  categoryId: string;
  groupId: string;
  locationId: string;
  operatorId: string;
  serialNumber: string;
  isActive: boolean;
  telemetryBoardId: number;
}

@injectable()
class EditMachineService {
  constructor(
    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,

    @inject('CategoriesRepository')
    private categoriesRepository: CategoriesRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('PointsOfSaleRepository')
    private pointsOfSaleRepository: PointsOfSaleRepository,

    @inject('CounterTypesRepository')
    private counterTypesRepository: CounterTypesRepository,

    @inject('RoutesRepository')
    private routesRepository: RoutesRepository,

    @inject('TelemetryBoardsRepository')
    private telemetryBoardsRepository: TelemetryBoardsRepository,
  ) {}

  public async execute({
    boxes,
    categoryId,
    gameValue,
    groupId,
    locationId,
    machineId,
    operatorId,
    serialNumber,
    userId,
    isActive,
    telemetryBoardId,
  }: Request): Promise<Machine> {
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

    if (user.role === Role.MANAGER || user.role === Role.OPERATOR) {
      if (!user.permissions?.editMachines) throw AppError.authorizationError;
    }

    const machine = await this.machinesRepository.findOne({
      by: 'id',
      value: machineId,
    });

    if (!machine) throw AppError.machineNotFound;

    if (user.role === Role.OWNER)
      if (user.id !== machine.ownerId) throw AppError.authorizationError;

    if (serialNumber && serialNumber !== machine.serialNumber) {
      const checkMachineExists = await this.machinesRepository.findOne({
        by: 'serialNumber',
        value: serialNumber,
      });

      if (checkMachineExists) throw AppError.labelAlreadyInUsed;

      machine.serialNumber = serialNumber;
    }

    if (operatorId !== undefined) {
      if (operatorId !== machine.operatorId && operatorId !== null) {
        const operator = await this.usersRepository.findOne({
          by: 'id',
          value: operatorId,
        });

        if (!operator) throw AppError.userNotFound;

        const checkMachineRoute = await this.routesRepository.findOne({
          machineIds: machineId,
        });

        if (checkMachineRoute && checkMachineRoute.operatorId !== operatorId)
          throw AppError.machineBelongsToARoute;

        if (!operator.groupIds?.includes(groupId))
          throw AppError.authorizationError;

        machine.operatorId = operatorId;
      } else if (operatorId === null) delete machine.operatorId;
    }

    if (locationId !== undefined && locationId !== null) {
      const pointOfSale = await this.pointsOfSaleRepository.findOne({
        by: 'id',
        value: locationId,
      });

      if (pointOfSale?.groupId !== groupId) throw AppError.authorizationError;
      machine.locationId = locationId;
    } else if (locationId === null) {
      machine.locationId = locationId;
    }

    if (gameValue) machine.gameValue = gameValue;

    if (groupId) {
      if (user.role === Role.OWNER) {
        const groups = await this.groupsRepository.find({
          filters: {
            ownerId: user.id,
          },
        });

        const groupIds = groups.map(group => group.id);

        if (!groupIds.includes(groupId)) throw AppError.authorizationError;
      }

      if (user.role === Role.MANAGER) {
        if (!user.permissions?.createMachines)
          throw AppError.authorizationError;
        if (!user.groupIds?.includes(groupId))
          throw AppError.authorizationError;
      }
      machine.groupId = groupId;
    }

    if (isActive !== undefined) machine.isActive = isActive;

    if (categoryId) {
      const category = await this.categoriesRepository.findOne({
        by: 'id',
        value: categoryId,
      });

      if (!category) throw AppError.machineCategoryNotFound;

      machine.categoryId = category.id;
      machine.categoryLabel = category.label;
    }

    if (boxes) {
      const boxesEntities = boxes.map(box => {
        const counters = box.counters.map(counter => new Counter(counter));
        return new Box({ id: box.id, counters });
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

      machine.boxes = boxesEntities;
    }

    if (telemetryBoardId !== undefined) {
      if (telemetryBoardId === null) {
        if (machine.telemetryBoardId) {
          const telemetry = await this.telemetryBoardsRepository.findById(
            machine.telemetryBoardId,
          );
          if (telemetry) {
            delete telemetry?.machineId;
            this.telemetryBoardsRepository.save(telemetry);
          }
        }

        delete machine.telemetryBoardId;
      } else if (telemetryBoardId !== machine.telemetryBoardId) {
        const telemetryBoard = await this.telemetryBoardsRepository.findById(
          telemetryBoardId,
        );

        if (!telemetryBoard) throw AppError.telemetryBoardNotFound;

        if (
          (user.role === Role.MANAGER || user.role === Role.OPERATOR) &&
          !user.groupIds?.includes(telemetryBoard.groupId)
        )
          throw AppError.authorizationError;

        if (user.role === Role.OWNER && telemetryBoard.ownerId !== user.id)
          throw AppError.authorizationError;

        const machineWithOlfTelemetryId = await this.machinesRepository.findOne(
          {
            by: 'telemetryBoardId',
            value: telemetryBoardId,
          },
        );

        if (machineWithOlfTelemetryId) {
          delete machineWithOlfTelemetryId.telemetryBoardId;
          this.machinesRepository.save(machineWithOlfTelemetryId);
        }

        machine.telemetryBoardId = telemetryBoardId;

        telemetryBoard.machineId = machine.id;

        this.telemetryBoardsRepository.save(telemetryBoard);
      }
    }

    this.machinesRepository.save(machine);

    await this.ormProvider.commit();

    return machine;
  }
}
export default EditMachineService;
