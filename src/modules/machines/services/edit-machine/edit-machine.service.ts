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
import LogsRepository from '@modules/logs/contracts/repositories/logs-repository';
import LogType from '@modules/logs/contracts/enums/log-type.enum';

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
  maintenance: boolean;
  typeOfPrizeId: string;
  minimumPrizeCount: number;
  incomePerMonthGoal: number;
  incomePerPrizeGoal: number;
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

    @inject('LogsRepository')
    private logsRepository: LogsRepository,
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
    maintenance,
    typeOfPrizeId,
    minimumPrizeCount,
    incomePerMonthGoal,
    incomePerPrizeGoal,
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

    if (groupId && groupId !== machine.groupId) {
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

      const group = await this.groupsRepository.findOne({
        by: 'id',
        value: machine.groupId,
      });

      if (!group) throw AppError.groupNotFound;

      this.logsRepository.create({
        createdBy: user.id,
        groupId: group.id,
        ownerId: group.ownerId,
        type: LogType.TRANSFER_MACHINE_TO_GROUP,
        machineId: machine.id,
      });

      machine.groupId = groupId;

      if (machine.telemetryBoardId) {
        const telemetryBoard = await this.telemetryBoardsRepository.findById(
          machine.telemetryBoardId,
        );
        if (telemetryBoard) {
          telemetryBoard.machineId = undefined;
          this.telemetryBoardsRepository.save(telemetryBoard);
        }
        machine.telemetryBoardId = undefined;
      }

      machine.operatorId = undefined;
      machine.locationId = undefined;
      machine.typeOfPrize = undefined;
      machine.minimumPrizeCount = undefined;
      machine.lastCollection = undefined;
      machine.lastConnection = undefined;

      this.machinesRepository.save(machine);

      await this.ormProvider.commit();

      return machine;
    }

    // ? ALTERA STATUS DA MAQUINA PARA DESATIVADA(DELETADA),
    // ? E DESVINCULAR A MACHINE DA TELEMETRY BOARD
    if (isActive !== undefined) {
      machine.isActive = isActive;
      if (machine.telemetryBoardId && machine.isActive === false) {
        const telemetryBoard = await this.telemetryBoardsRepository.findById(
          machine.telemetryBoardId,
        );
        if (telemetryBoard) {
          telemetryBoard.machineId = undefined;
          this.telemetryBoardsRepository.save(telemetryBoard);
        }
        machine.telemetryBoardId = undefined;
        machine.lastConnection = undefined;
      }
    }

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

        if (machine.locationId !== undefined) {
          const checkMachineRoute = await this.routesRepository.findOne({
            pointsOfSaleId: machine.locationId,
          });

          if (
            checkMachineRoute &&
            checkMachineRoute.operatorId &&
            checkMachineRoute.operatorId !== operatorId
          )
            throw AppError.machineBelongsToARoute;
        }

        if (!operator.groupIds?.includes(groupId))
          throw AppError.authorizationError;

        machine.operatorId = operatorId;
      } else if (operatorId === null) machine.operatorId = undefined;
    }

    if (gameValue) machine.gameValue = gameValue;

    const group = await this.groupsRepository.findOne({
      by: 'id',
      value: machine.groupId,
    });

    if (!group) throw AppError.groupNotFound;

    if (typeOfPrizeId !== undefined && typeOfPrizeId !== null) {
      const prize = group?.stock.prizes.find(
        prize => prize.id === typeOfPrizeId,
      );

      if (!prize) throw AppError.productNotFound;

      machine.typeOfPrize = {
        id: prize.id,
        label: prize.label,
      };
    } else if (typeOfPrizeId === null) {
      machine.typeOfPrize = undefined;
    }

    if (locationId !== undefined && locationId !== null) {
      const pointOfSale = await this.pointsOfSaleRepository.findOne({
        by: 'id',
        value: locationId,
      });

      if (!pointOfSale) throw AppError.pointOfSaleNotFound;

      const route = await this.routesRepository.findOne({
        pointsOfSaleId: pointOfSale.id,
      });

      if (route) machine.operatorId = route.operatorId;

      machine.locationId = locationId;
    } else if (locationId === null) {
      machine.locationId = locationId;
      machine.operator = undefined;
    }

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
        return new Box({
          id: box.id,
          counters,
          currentMoney: machine.boxes.find(boxx => boxx.id === box.id)
            ?.currentMoney,
          numberOfPrizes: machine.boxes.find(boxx => boxx.id === box.id)
            ?.numberOfPrizes,
        });
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

    if (telemetryBoardId !== undefined && machine.isActive) {
      if (telemetryBoardId === null) {
        if (machine.telemetryBoardId) {
          const telemetryBoard = await this.telemetryBoardsRepository.findById(
            machine.telemetryBoardId,
          );
          if (telemetryBoard) {
            telemetryBoard.machineId = undefined;
            this.telemetryBoardsRepository.save(telemetryBoard);
          }
        }

        machine.lastConnection = undefined;
        machine.telemetryBoardId = undefined;
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

        machine.lastConnection = undefined;
        if (machine.telemetryBoardId) {
          const oldTelemetry = await this.telemetryBoardsRepository.findById(
            machine.telemetryBoardId,
          );

          if (oldTelemetry) {
            oldTelemetry.machineId = undefined;
            this.telemetryBoardsRepository.save(oldTelemetry);
          }
        }

        machine.telemetryBoardId = telemetryBoardId;

        telemetryBoard.machineId = machine.id;

        telemetryBoard.groupId = machine.groupId;

        this.telemetryBoardsRepository.save(telemetryBoard);
      }
    }

    if (maintenance !== undefined) machine.maintenance = maintenance;

    if (incomePerMonthGoal !== undefined)
      machine.incomePerMonthGoal = incomePerMonthGoal;

    if (incomePerPrizeGoal !== undefined)
      machine.incomePerPrizeGoal = incomePerPrizeGoal;

    if (minimumPrizeCount !== undefined && minimumPrizeCount !== null) {
      machine.minimumPrizeCount = minimumPrizeCount;
    } else if (minimumPrizeCount === null) {
      machine.minimumPrizeCount = undefined;
    }

    this.machinesRepository.save(machine);

    if (locationId !== undefined && locationId !== null) {
      this.logsRepository.create({
        createdBy: user.id,
        groupId: group.id,
        ownerId: group.ownerId,
        type: LogType.TRANSFER_MACHINE_TO_POS,
        destinationId: locationId,
        machineId: machine.id,
      });
    } else if (locationId === null) {
      this.logsRepository.create({
        createdBy: user.id,
        groupId: group.id,
        ownerId: group.ownerId,
        type: LogType.TRANSFER_MACHINE_TO_POS,
        destinationId: undefined,
        machineId: machine.id,
      });
    } else {
      this.logsRepository.create({
        createdBy: user.id,
        groupId: group.id,
        ownerId: group.ownerId,
        type:
          isActive === false ? LogType.DELETE_MACHINE : LogType.EDIT_MACHINE,
        machineId: machine.id,
      });
    }

    await this.ormProvider.commit();

    return machine;
  }
}
export default EditMachineService;
