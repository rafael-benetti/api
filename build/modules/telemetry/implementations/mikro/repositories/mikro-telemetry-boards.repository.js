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
const create_telemetry_board_dto_1 = __importDefault(require("../../../contracts/dtos/create-telemetry-board.dto"));
const find_telemetry_boards_dto_1 = __importDefault(require("../../../contracts/dtos/find-telemetry-boards.dto"));
const telemetry_board_1 = __importDefault(require("../../../contracts/entities/telemetry-board"));
const telemetry_boards_repository_1 = __importDefault(require("../../../contracts/repositories/telemetry-boards.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const mikro_telemetry_board_1 = __importDefault(require("../entities/mikro-telemetry-board"));
const telemetry_board_mapper_1 = __importDefault(require("../mappers/telemetry-board.mapper"));
let MikroTelemetryBoardsRepository = class MikroTelemetryBoardsRepository {
    constructor(ormProvider) {
        this.ormProvider = ormProvider;
        this.repository = this.ormProvider.entityManager.getRepository(mikro_telemetry_board_1.default);
    }
    async create(data) {
        const id = (await this.repository.count()) + 1;
        const telemetryBoard = new mikro_telemetry_board_1.default(data);
        telemetryBoard.id = id;
        this.repository.persist(telemetryBoard);
        return telemetry_board_mapper_1.default.toApi(telemetryBoard);
    }
    async findById(id) {
        const telemetryBoard = await this.repository.findOne({
            id,
        }, {
            populate: ['machine', 'group'],
            fields: [
                'ownerId',
                'groupId',
                'group',
                'machineId',
                'machine.serialNumber',
                'lastConnection',
                'connectionStrength',
                'connectionType',
            ],
        });
        return telemetryBoard
            ? telemetry_board_mapper_1.default.toApi(telemetryBoard)
            : undefined;
    }
    async find(data) {
        const query = {};
        if (data.filters.groupIds && data.filters.groupIds.length > 0)
            query.groupId = {
                $in: data.filters.groupIds,
            };
        if (data.filters.id) {
            query.id = {
                $in: data.filters.id,
            };
        }
        if (data.filters.ownerId)
            query.ownerId = data.filters.ownerId;
        const [telemetryBoards, count] = await this.repository.findAndCount({ ...query }, {
            limit: data.limit,
            offset: data.offset,
            populate: ['machine', 'group', 'owner'],
            orderBy: {
                _id: 'ASC',
            },
            fields: [
                'ownerId',
                'groupId',
                'group',
                'owner',
                'machineId',
                'machine.serialNumber',
                'lastConnection',
                'connectionStrength',
                'connectionType',
            ],
        });
        return {
            telemetryBoards: telemetryBoards.map(board => telemetry_board_mapper_1.default.toApi(board)),
            count,
        };
    }
    save(data) {
        const telemetryBoard = telemetry_board_mapper_1.default.toOrm(data);
        this.repository.persist(telemetryBoard);
    }
};
MikroTelemetryBoardsRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [mikro_orm_provider_1.default])
], MikroTelemetryBoardsRepository);
exports.default = MikroTelemetryBoardsRepository;
