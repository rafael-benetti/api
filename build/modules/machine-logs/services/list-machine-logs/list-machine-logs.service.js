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
const groups_repository_1 = __importDefault(require("../../../groups/contracts/repositories/groups.repository"));
const machine_log_1 = __importDefault(require("../../contracts/entities/machine-log"));
const machine_log_type_1 = __importDefault(require("../../contracts/enums/machine-log-type"));
const machine_logs_repository_1 = __importDefault(require("../../contracts/repositories/machine-logs.repository"));
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let ListMachineLogsService = class ListMachineLogsService {
    constructor(usersRepository, machineLogsRepository, machinesRepository, groupsRepository) {
        this.usersRepository = usersRepository;
        this.machineLogsRepository = machineLogsRepository;
        this.machinesRepository = machinesRepository;
        this.groupsRepository = groupsRepository;
    }
    async execute({ machineId, userId, type, startDate, endDate, limit, offset, }) {
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
        if (user.role !== role_1.default.MANAGER &&
            user.role !== role_1.default.OPERATOR &&
            user.role !== role_1.default.OWNER)
            throw app_error_1.default.authorizationError;
        if (user.role === role_1.default.MANAGER || user.role === role_1.default.OPERATOR) {
            if (!user.groupIds?.includes(machine.groupId))
                throw app_error_1.default.authorizationError;
        }
        if (user.role === role_1.default.OWNER) {
            const groupIds = (await this.groupsRepository.find({
                filters: {
                    ownerId: user.id,
                },
            })).map(group => group.id);
            if (!groupIds.includes(machine.groupId))
                throw app_error_1.default.authorizationError;
        }
        const { machineLogs, count, } = await this.machineLogsRepository.findAndCount({
            startDate,
            endDate,
            groupId: machine.groupId,
            machineId,
            type,
            populate: ['user'],
            fields: [
                'user.name',
                'machineId',
                'groupId',
                'observations',
                'type',
                'createdAt',
                'createdBy',
                'quantity',
            ],
            offset,
            limit,
        });
        return { machineLogs, count };
    }
};
ListMachineLogsService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('MachineLogsRepository')),
    __param(2, tsyringe_1.inject('MachinesRepository')),
    __param(3, tsyringe_1.inject('GroupsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ListMachineLogsService);
exports.default = ListMachineLogsService;
