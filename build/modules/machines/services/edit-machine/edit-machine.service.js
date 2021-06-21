"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categories_repository_1 = __importDefault(require("../../../categories/contracts/repositories/categories.repository"));
const box_1 = __importDefault(require("../../contracts/models/box"));
const counter_1 = __importDefault(require("../../contracts/models/counter"));
const machine_1 = __importDefault(require("../../contracts/models/machine"));
const machines_repository_1 = __importDefault(require("../../contracts/repositories/machines.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const groups_repository_1 = __importDefault(require("../../../groups/contracts/repositories/groups.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
const points_of_sale_repository_1 = __importDefault(require("../../../points-of-sale/contracts/repositories/points-of-sale.repository"));
const couter_types_repository_1 = __importDefault(require("../../../counter-types/contracts/repositories/couter-types.repository"));
const routes_repository_1 = __importDefault(require("../../../routes/contracts/repositories/routes.repository"));
const telemetry_boards_repository_1 = __importDefault(require("../../../telemetry/contracts/repositories/telemetry-boards.repository"));
let EditMachineService = class EditMachineService {
    constructor(machinesRepository, usersRepository, ormProvider, categoriesRepository, groupsRepository, pointsOfSaleRepository, counterTypesRepository, routesRepository, telemetryBoardsRepository) {
        this.machinesRepository = machinesRepository;
        this.usersRepository = usersRepository;
        this.ormProvider = ormProvider;
        this.categoriesRepository = categoriesRepository;
        this.groupsRepository = groupsRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.counterTypesRepository = counterTypesRepository;
        this.routesRepository = routesRepository;
        this.telemetryBoardsRepository = telemetryBoardsRepository;
    }
    async execute({ boxes, categoryId, gameValue, groupId, locationId, machineId, operatorId, serialNumber, userId, isActive, telemetryBoardId, maintenance, typeOfPrizeId, minimumPrizeCount, incomePerMonthGoal, incomePerPrizeGoal, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.MANAGER &&
            user.role !== role_1.default.OWNER &&
            user.role !== role_1.default.OPERATOR)
            throw app_error_1.default.authorizationError;
        if (user.role === role_1.default.MANAGER || user.role === role_1.default.OPERATOR) {
            if (!user.permissions?.editMachines)
                throw app_error_1.default.authorizationError;
        }
        const machine = await this.machinesRepository.findOne({
            by: 'id',
            value: machineId,
        });
        if (!machine)
            throw app_error_1.default.machineNotFound;
        if (user.role === role_1.default.OWNER)
            if (user.id !== machine.ownerId)
                throw app_error_1.default.authorizationError;
        if (groupId && groupId !== machine.groupId) {
            if (user.role === role_1.default.OWNER) {
                const groups = await this.groupsRepository.find({
                    filters: {
                        ownerId: user.id,
                    },
                });
                const groupIds = groups.map(group => group.id);
                if (!groupIds.includes(groupId))
                    throw app_error_1.default.authorizationError;
            }
            if (user.role === role_1.default.MANAGER) {
                if (!user.permissions?.createMachines)
                    throw app_error_1.default.authorizationError;
                if (!user.groupIds?.includes(groupId))
                    throw app_error_1.default.authorizationError;
            }
            machine.groupId = groupId;
            if (machine.telemetryBoardId) {
                const telemetryBoard = await this.telemetryBoardsRepository.findById(machine.telemetryBoardId);
                if (telemetryBoard)
                    telemetryBoard.machineId = undefined;
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
                const telemetryBoard = await this.telemetryBoardsRepository.findById(machine.telemetryBoardId);
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
            if (checkMachineExists)
                throw app_error_1.default.labelAlreadyInUsed;
            machine.serialNumber = serialNumber;
        }
        if (operatorId !== undefined) {
            if (operatorId !== machine.operatorId && operatorId !== null) {
                const operator = await this.usersRepository.findOne({
                    by: 'id',
                    value: operatorId,
                });
                if (!operator)
                    throw app_error_1.default.userNotFound;
                if (machine.locationId !== undefined) {
                    const checkMachineRoute = await this.routesRepository.findOne({
                        pointsOfSaleId: machine.locationId,
                    });
                    if (checkMachineRoute &&
                        checkMachineRoute.operatorId &&
                        checkMachineRoute.operatorId !== operatorId)
                        throw app_error_1.default.machineBelongsToARoute;
                }
                if (!operator.groupIds?.includes(groupId))
                    throw app_error_1.default.authorizationError;
                machine.operatorId = operatorId;
            }
            else if (operatorId === null)
                delete machine.operatorId;
        }
        if (gameValue)
            machine.gameValue = gameValue;
        if (typeOfPrizeId !== undefined && typeOfPrizeId !== null) {
            const group = await this.groupsRepository.findOne({
                by: 'id',
                value: machine.groupId,
            });
            const prize = group?.stock.prizes.find(prize => prize.id === typeOfPrizeId);
            if (!prize)
                throw app_error_1.default.productNotFound;
            machine.typeOfPrize = {
                id: prize.id,
                label: prize.label,
            };
        }
        else if (typeOfPrizeId === null) {
            machine.typeOfPrize = undefined;
        }
        if (locationId !== undefined && locationId !== null) {
            const pointOfSale = await this.pointsOfSaleRepository.findOne({
                by: 'id',
                value: locationId,
            });
            if (!pointOfSale)
                throw app_error_1.default.pointOfSaleNotFound;
            machine.locationId = locationId;
        }
        else if (locationId === null)
            machine.locationId = locationId;
        if (categoryId) {
            const category = await this.categoriesRepository.findOne({
                by: 'id',
                value: categoryId,
            });
            if (!category)
                throw app_error_1.default.machineCategoryNotFound;
            machine.categoryId = category.id;
            machine.categoryLabel = category.label;
        }
        if (boxes) {
            const boxesEntities = boxes.map(box => {
                const counters = box.counters.map(counter => new counter_1.default(counter));
                return new box_1.default({
                    id: box.id,
                    counters,
                    currentMoney: machine.boxes.find(boxx => boxx.id === box.id)
                        ?.currentMoney,
                    numberOfPrizes: machine.boxes.find(boxx => boxx.id === box.id)
                        ?.numberOfPrizes,
                });
            });
            const counterTypeIds = [
                ...new Set(boxesEntities.flatMap(boxe => boxe.counters.map(counter => counter.counterTypeId))),
            ];
            const counterTypes = await this.counterTypesRepository.find({
                id: counterTypeIds,
            });
            if (counterTypeIds.length !== counterTypes.length)
                throw app_error_1.default.authorizationError;
            machine.boxes = boxesEntities;
        }
        if (telemetryBoardId !== undefined && machine.isActive) {
            if (telemetryBoardId === null) {
                if (machine.telemetryBoardId) {
                    const telemetryBoard = await this.telemetryBoardsRepository.findById(machine.telemetryBoardId);
                    if (telemetryBoard) {
                        delete telemetryBoard?.machineId;
                        this.telemetryBoardsRepository.save(telemetryBoard);
                    }
                }
                machine.lastConnection = undefined;
                delete machine.telemetryBoardId;
            }
            else if (telemetryBoardId !== machine.telemetryBoardId) {
                const telemetryBoard = await this.telemetryBoardsRepository.findById(telemetryBoardId);
                if (!telemetryBoard)
                    throw app_error_1.default.telemetryBoardNotFound;
                if ((user.role === role_1.default.MANAGER || user.role === role_1.default.OPERATOR) &&
                    !user.groupIds?.includes(telemetryBoard.groupId))
                    throw app_error_1.default.authorizationError;
                if (user.role === role_1.default.OWNER && telemetryBoard.ownerId !== user.id)
                    throw app_error_1.default.authorizationError;
                machine.lastConnection = undefined;
                if (machine.telemetryBoardId) {
                    const oldTelemetry = await this.telemetryBoardsRepository.findById(machine.telemetryBoardId);
                    if (oldTelemetry) {
                        delete oldTelemetry.machineId;
                        this.telemetryBoardsRepository.save(oldTelemetry);
                    }
                }
                machine.telemetryBoardId = telemetryBoardId;
                telemetryBoard.machineId = machine.id;
                telemetryBoard.groupId = machine.groupId;
                this.telemetryBoardsRepository.save(telemetryBoard);
            }
        }
        if (maintenance !== undefined)
            machine.maintenance = maintenance;
        if (incomePerMonthGoal !== undefined)
            machine.incomePerMonthGoal = incomePerMonthGoal;
        if (incomePerPrizeGoal !== undefined)
            machine.incomePerPrizeGoal = incomePerPrizeGoal;
        if (minimumPrizeCount !== undefined && minimumPrizeCount !== null) {
            machine.minimumPrizeCount = minimumPrizeCount;
        }
        else if (minimumPrizeCount === null) {
            machine.minimumPrizeCount = undefined;
        }
        this.machinesRepository.save(machine);
        await this.ormProvider.commit();
        return machine;
    }
};
EditMachineService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('MachinesRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __param(2, tsyringe_1.inject('OrmProvider')),
    __param(3, tsyringe_1.inject('CategoriesRepository')),
    __param(4, tsyringe_1.inject('GroupsRepository')),
    __param(5, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(6, tsyringe_1.inject('CounterTypesRepository')),
    __param(7, tsyringe_1.inject('RoutesRepository')),
    __param(8, tsyringe_1.inject('TelemetryBoardsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object])
], EditMachineService);
exports.default = EditMachineService;
