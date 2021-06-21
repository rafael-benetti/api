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
const ioredis_1 = __importDefault(require("ioredis"));
const telemetry_boards_repository_1 = __importDefault(require("../../../../modules/telemetry/contracts/repositories/telemetry-boards.repository"));
const groups_repository_1 = __importDefault(require("../../../../modules/groups/contracts/repositories/groups.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const type_machines_repository_1 = __importDefault(require("../../machines/typeorm/repositories/type-machines.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const logger_1 = __importDefault(require("../../../../config/logger"));
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
            try {
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
                // const groupId = (await this.client.get(
                //   `@groups:${typeTelemetry.companyId}`,
                // )) as string;
                //
                // const group = await this.groupsRepository.findOne({
                //   by: 'id',
                //   value: groupId,
                // });
                // if (!group) throw AppError.groupNotFound;
                // const typeMachine = await this.typeMachinesRepository.findOne(
                //  typeTelemetry.id,
                // );
                // const telemetry =
                const listaDoIvan = [
                    2,
                    6,
                    9,
                    11,
                    12,
                    14,
                    15,
                    16,
                    17,
                    19,
                    20,
                    21,
                    22,
                    24,
                    25,
                    26,
                    27,
                    28,
                    30,
                    32,
                    33,
                    34,
                    35,
                    36,
                    37,
                    38,
                    39,
                    41,
                    42,
                    43,
                    44,
                ];
                const vetorDoEdnilson = [31];
                const vetorDoLeo = [23];
                const vetorDoJucelio = [13];
                let groupId;
                let ownerId;
                if (listaDoIvan.includes(typeTelemetry.companyId)) {
                    groupId = '8369b438-8f8e-41eb-a0d5-52148bf91689';
                    ownerId = 'cb3f75bd-08e6-4419-b6e0-e2361677f4a8';
                }
                if (vetorDoEdnilson.includes(typeTelemetry.companyId)) {
                    groupId = '736fc46c-75f7-4976-911d-a90d1ec54ea1';
                    ownerId = '71399704-f727-4e63-aecb-eb290f64d278';
                }
                if (vetorDoJucelio.includes(typeTelemetry.companyId)) {
                    groupId = 'd6736138-8b4e-42fc-841f-4312a57706b1';
                    ownerId = '61bc37e5-e160-4752-b79d-621a9424657d';
                }
                if (vetorDoLeo.includes(typeTelemetry.companyId)) {
                    groupId = '68fa01e7-faf0-4d2b-a038-b106046428be';
                    ownerId = '50eb9e7d-538e-4b76-92c5-da050b230fd1';
                }
                await this.telemetryBoardsRepository.create({
                    connectionStrength: undefined,
                    lastConnection: undefined,
                    connectionType: undefined,
                    groupId: groupId || 'null',
                    integratedCircuitCardId: typeTelemetry.iccid?.toString(),
                    ownerId: ownerId || 'null',
                    machineId: undefined, // typeMachine?.id.toString(),
                });
                await this.ormProvider.commit();
                count += 1;
                // await this.client.set(
                //   `@telemetryBoards:${typeTelemetry.id}`,
                //   `${telemetry.id}`,
                // );
            }
            catch (error) {
                logger_1.default.info(typeTelemetry.companyId);
                logger_1.default.info(error);
            }
        }
        this.ormProvider.clear();
    }
    async setMachineId() {
        this.ormProvider.clear();
        const { telemetryBoards } = await this.telemetryBoardsRepository.find({
            filters: {},
        });
        for (const telemetry of telemetryBoards) {
            const machineId = (await this.client.get(`@machines:${telemetry.machineId}`));
            const ownerId = (await this.client.get(`@users:${telemetry.ownerId}`));
            telemetry.machineId = machineId;
            telemetry.ownerId = ownerId;
            this.telemetryBoardsRepository.save(telemetry);
        }
        await this.ormProvider.commit();
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
