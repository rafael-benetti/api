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
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const telemetry_board_1 = __importDefault(require("../../contracts/entities/telemetry-board"));
const telemetry_boards_repository_1 = __importDefault(require("../../contracts/repositories/telemetry-boards.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let ListTelemetryBoardsService = class ListTelemetryBoardsService {
    constructor(usersRepository, telemetryBoardsRepository, machinesRepository) {
        this.usersRepository = usersRepository;
        this.telemetryBoardsRepository = telemetryBoardsRepository;
        this.machinesRepository = machinesRepository;
    }
    async execute({ userId, groupId, telemetryBoardId, limit, offset, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        let groupIds;
        let telemetryBoardIds;
        if (groupId) {
            groupIds = [groupId];
        }
        else if (user.role === role_1.default.MANAGER) {
            groupIds = user.groupIds;
        }
        else if (user.role === role_1.default.OPERATOR) {
            const { machines } = await this.machinesRepository.find({
                operatorId: user.id,
            });
            telemetryBoardIds = machines
                .map(machine => machine.telemetryBoardId)
                .filter(telemetryBoardId => telemetryBoardId);
            groupIds = user.groupIds;
        }
        if (telemetryBoardId)
            telemetryBoardIds = [telemetryBoardId];
        const { telemetryBoards, count, } = await this.telemetryBoardsRepository.find({
            filters: {
                id: telemetryBoardIds,
                ownerId: user.role === role_1.default.OWNER && !groupId ? user.id : undefined,
                groupIds: user.role === role_1.default.OWNER && groupId ? undefined : groupIds,
            },
            limit,
            offset,
        });
        return { telemetryBoards, count };
    }
};
ListTelemetryBoardsService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('TelemetryBoardsRepository')),
    __param(2, tsyringe_1.inject('MachinesRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ListTelemetryBoardsService);
exports.default = ListTelemetryBoardsService;
