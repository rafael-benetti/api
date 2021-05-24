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
const telemetry_logs_repository_1 = __importDefault(require("../../../../modules/telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const type_machines_repository_1 = __importDefault(require("../../machines/typeorm/repositories/type-machines.repository"));
const logger_1 = __importDefault(require("../../../../config/logger"));
const type_credits_repository_1 = __importDefault(require("../typeorm/repositories/type-credits.repository"));
let CreditsScript = class CreditsScript {
    constructor(typeCreditsRepository, telemetryLogsRepository, typeMachinesRepository, ormProvider) {
        this.typeCreditsRepository = typeCreditsRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.typeMachinesRepository = typeMachinesRepository;
        this.ormProvider = ormProvider;
        this.client = new ioredis_1.default();
    }
    async execute() {
        await this.telemetryLogsRepository.getIncomePerMachine({ groupIds: [] });
        // this.ormProvider.clear();
        // const credits = await this.typeCreditsRepository.find();
        // let count = 0;
        //
        // try {
        //  for (const credit of credits) {
        //    const telemetryBoardId = (await this.client.get(
        //      `@telemetryBoards:${credit.telemetryId}`,
        //    )) as string;
        //
        //    const pointOfSaleId = (await this.client.get(
        //      `@points:${credit.sellingPointId}`,
        //    )) as string;
        //
        //    const machine = await this.typeMachinesRepository.findOne(
        //      credit.telemetryId,
        //    );
        //
        //    let groupId = 'null';
        //
        //    if (machine) {
        //      groupId = (await this.client.get(
        //        `@groups:${machine.companyId}`,
        //      )) as string;
        //    }
        //
        //    this.telemetryLogsRepository.create({
        //      date: credit.date,
        //      machineId: credit.machineId.toString(),
        //      maintenance: credit.isTest === 1,
        //      pin: credit.pin ? credit.pin.toString() : undefined,
        //      telemetryBoardId,
        //      type: 'IN',
        //      value: Number(credit.value),
        //      pointOfSaleId,
        //      routeId: undefined,
        //      groupId,
        //      numberOfPlays: credit.value / credit.gameValue,
        //    });
        //    count += 1;
        //    if (count % 30000 === 0) {
        //      await this.ormProvider.commit();
        //      this.ormProvider.clear();
        //      logger.info(count);
        //    }
        //  }
        // } catch (error) {
        //  logger.error(error);
        //
        //  await this.ormProvider.commit();
        // }
    }
};
CreditsScript = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('TypeCreditsRepository')),
    __param(1, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(2, tsyringe_1.inject('TypeMachinesRepository')),
    __param(3, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [type_credits_repository_1.default, Object, type_machines_repository_1.default, Object])
], CreditsScript);
exports.default = CreditsScript;
