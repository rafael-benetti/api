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
const machine_log_type_1 = __importDefault(require("../../../machine-logs/contracts/enums/machine-log-type"));
const machine_logs_repository_1 = __importDefault(require("../../../machine-logs/contracts/repositories/machine-logs.repository"));
const machine_1 = __importDefault(require("../../contracts/models/machine"));
const machines_repository_1 = __importDefault(require("../../contracts/repositories/machines.repository"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const get_group_universe_1 = __importDefault(require("../../../../shared/utils/get-group-universe"));
const is_in_group_universe_1 = __importDefault(require("../../../../shared/utils/is-in-group-universe"));
const tsyringe_1 = require("tsyringe");
let FixMachineStockService = class FixMachineStockService {
    constructor(usersRepository, machinesRepository, machineLogsRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.machinesRepository = machinesRepository;
        this.machineLogsRepository = machineLogsRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, machineId, boxId, quantity, observations, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        const machine = await this.machinesRepository.findOne({
            by: 'id',
            value: machineId,
        });
        if (!machine)
            throw app_error_1.default.machineNotFound;
        const universe = await get_group_universe_1.default(user);
        if (!is_in_group_universe_1.default({
            universe,
            groups: [machine.groupId],
            method: 'INTERSECTION',
        }))
            throw app_error_1.default.authorizationError;
        const box = machine.boxes.find(box => box.id === boxId);
        if (!box)
            throw app_error_1.default.boxNotFound;
        box.numberOfPrizes = quantity;
        this.machinesRepository.save(machine);
        this.machineLogsRepository.create({
            createdAt: new Date(),
            createdBy: user.id,
            machineId: machine.id,
            groupId: machine.groupId,
            observations,
            type: machine_log_type_1.default.FIX_STOCK,
        });
        await this.ormProvider.commit();
        return machine;
    }
};
FixMachineStockService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('MachinesRepository')),
    __param(2, tsyringe_1.inject('MachineLogsRepository')),
    __param(3, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], FixMachineStockService);
exports.default = FixMachineStockService;
