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
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const tsyringe_1 = require("tsyringe");
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const ioredis_1 = __importDefault(require("ioredis"));
const telemetry_boards_repository_1 = __importDefault(require("../../../../modules/telemetry/contracts/repositories/telemetry-boards.repository"));
const groups_repository_1 = __importDefault(require("../../../../modules/groups/contracts/repositories/groups.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const type_machines_repository_1 = __importDefault(require("../../machines/typeorm/repositories/type-machines.repository"));
const type_telemetries_repository_1 = __importDefault(require("../typeorm/repositories/type-telemetries.repository"));
let TelemetriesScript = class TelemetriesScript {
    constructor(typeTelemetriesRepository, telemetryBoardsRepository, typeMachinesRepository, groupsRepository, ormProvider) {
        this.typeTelemetriesRepository = typeTelemetriesRepository;
        this.telemetryBoardsRepository = telemetryBoardsRepository;
        this.typeMachinesRepository = typeMachinesRepository;
        this.groupsRepository = groupsRepository;
        this.ormProvider = ormProvider;
        this.client = new ioredis_1.default();
    }
    async execute() {
        const typeTelemetries = await this.typeTelemetriesRepository.find();
        let count = 1;
        for (const typeTelemetry of typeTelemetries) {
            while (count < typeTelemetry.id) {
                await this.telemetryBoardsRepository.create({
                    connectionStrength: undefined,
                    lastConnection: undefined,
                    connectionType: undefined,
                    groupId: 'null',
                    integratedCircuitCardId: undefined,
                    ownerId: 'null',
                    machineId: undefined,
                });
                await this.ormProvider.commit();
                count += 1;
            }
            const groupId = (await this.client.get(`@groups:${typeTelemetry.companyId}`));
            const group = await this.groupsRepository.findOne({
                by: 'id',
                value: groupId,
            });
            if (!group)
                throw app_error_1.default.groupNotFound;
            const typeMachine = await this.typeMachinesRepository.findOne(typeTelemetry.id);
            const telemetry = await this.telemetryBoardsRepository.create({
                connectionStrength: undefined,
                lastConnection: typeTelemetry.lastCommunication,
                connectionType: typeTelemetry.connectionType,
                groupId,
                integratedCircuitCardId: typeTelemetry.iccid?.toString(),
                ownerId: group.ownerId,
                machineId: typeMachine?.id.toString(),
            });
            await this.ormProvider.commit();
            count += 1;
            await this.client.set(`@telemetryBoards:${typeTelemetry.id}`, `${telemetry.id}`);
        }
        this.ormProvider.clear();
    }
};
TelemetriesScript = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('TypeTelemetriesRepository')),
    __param(1, tsyringe_1.inject('TelemetryBoardsRepository')),
    __param(2, tsyringe_1.inject('TypeMachinesRepository')),
    __param(3, tsyringe_1.inject('GroupsRepository')),
    __param(4, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [type_telemetries_repository_1.default, Object, type_machines_repository_1.default, Object, Object])
], TelemetriesScript);
exports.default = TelemetriesScript;
