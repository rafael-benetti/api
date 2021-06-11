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
const machine_log_type_1 = __importDefault(require("../../contracts/enums/machine-log-type"));
const machine_logs_repository_1 = __importDefault(require("../../contracts/repositories/machine-logs.repository"));
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const mqtt_provider_1 = __importDefault(require("../../../../providers/mqtt-provider/contracts/models/mqtt-provider"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let RemoteCreditService = class RemoteCreditService {
    constructor(usersRepository, machinesRepository, machineLogsRepository, mqttProvider, ormProvider) {
        this.usersRepository = usersRepository;
        this.machinesRepository = machinesRepository;
        this.machineLogsRepository = machineLogsRepository;
        this.mqttProvider = mqttProvider;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, machineId, observations, quantity, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.OWNER && !user.permissions?.addRemoteCredit)
            throw app_error_1.default.authorizationError;
        const machine = await this.machinesRepository.findOne({
            by: 'id',
            value: machineId,
        });
        if (!machine)
            throw app_error_1.default.machineNotFound;
        if (!machine.telemetryBoardId)
            throw app_error_1.default.telemetryBoardNotFound;
        const payload = {
            type: 'remoteCredit',
            credit: 1,
        };
        this.mqttProvider.publish({
            topic: `sub/${machine.telemetryBoardId}`,
            payload: JSON.stringify(payload),
        });
        this.machineLogsRepository.create({
            createdBy: user.id,
            groupId: machine.groupId,
            machineId: machine.id,
            observations,
            type: machine_log_type_1.default.REMOTE_CREDIT,
            quantity,
        });
        await this.ormProvider.commit();
    }
};
RemoteCreditService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('MachinesRepository')),
    __param(2, tsyringe_1.inject('MachineLogsRepository')),
    __param(3, tsyringe_1.inject('MqttProvider')),
    __param(4, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], RemoteCreditService);
exports.default = RemoteCreditService;
