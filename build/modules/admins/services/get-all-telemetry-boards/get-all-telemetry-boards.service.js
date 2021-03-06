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
const admins_repository_1 = __importDefault(require("../../contracts/repositories/admins.repository"));
const telemetry_board_1 = __importDefault(require("../../../telemetry/contracts/entities/telemetry-board"));
const telemetry_boards_repository_1 = __importDefault(require("../../../telemetry/contracts/repositories/telemetry-boards.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let GetAllTelemetryBoardsService = class GetAllTelemetryBoardsService {
    constructor(telemetryBoardsRepository, adminsRepository) {
        this.telemetryBoardsRepository = telemetryBoardsRepository;
        this.adminsRepository = adminsRepository;
    }
    async execute({ userId, id, limit, offset, orderBy, ownerId, groupId, }) {
        const admin = await this.adminsRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!admin)
            throw app_error_1.default.authorizationError;
        const telemetryBoards = await this.telemetryBoardsRepository.find({
            filters: {
                ...(id && { id: [id] }),
                ...(groupId && { groupIds: [groupId] }),
                ownerId,
            },
            ...(orderBy && { orderBy }),
            limit,
            offset,
        });
        return telemetryBoards;
    }
};
GetAllTelemetryBoardsService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('TelemetryBoardsRepository')),
    __param(1, tsyringe_1.inject('AdminsRepository')),
    __metadata("design:paramtypes", [Object, Object])
], GetAllTelemetryBoardsService);
exports.default = GetAllTelemetryBoardsService;
