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
const telemetry_board_1 = __importDefault(require("../../../telemetry/contracts/entities/telemetry-board"));
const telemetry_boards_repository_1 = __importDefault(require("../../../telemetry/contracts/repositories/telemetry-boards.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let CreateTelemetryBoardService = class CreateTelemetryBoardService {
    constructor(usersRepository, groupsRepository, telemetryBoardsRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
        this.telemetryBoardsRepository = telemetryBoardsRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ ownerId, integratedCircuitCardId, }) {
        const owner = await this.usersRepository.findOne({
            by: 'id',
            value: ownerId,
        });
        if (!owner || owner.role !== role_1.default.OWNER)
            throw app_error_1.default.authorizationError;
        const personalGroup = await this.groupsRepository
            .find({
            filters: {
                ownerId,
                isPersonal: true,
            },
        })
            .then(groups => groups[0]);
        const telemetryBoard = await this.telemetryBoardsRepository.create({
            ownerId,
            groupId: personalGroup.id,
            integratedCircuitCardId,
        });
        await this.ormProvider.commit();
        return telemetryBoard;
    }
};
CreateTelemetryBoardService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('GroupsRepository')),
    __param(2, tsyringe_1.inject('TelemetryBoardsRepository')),
    __param(3, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CreateTelemetryBoardService);
exports.default = CreateTelemetryBoardService;
