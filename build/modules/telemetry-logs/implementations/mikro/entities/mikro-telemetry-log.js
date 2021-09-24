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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const create_telemetry_log_dto_1 = __importDefault(require("../../../contracts/dtos/create-telemetry-log.dto"));
const telemetry_log_1 = __importDefault(require("../../../contracts/entities/telemetry-log"));
const uuid_1 = require("uuid");
let MikroTelemetryLog = class MikroTelemetryLog {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.date = data.date;
            this.groupId = data.groupId;
            this.machineId = data.machineId;
            this.maintenance = data.maintenance;
            this.pin = data.pin;
            this.pointOfSaleId = data.pointOfSaleId;
            this.routeId = data.routeId;
            this.telemetryBoardId = data.telemetryBoardId;
            this.type = data.type;
            this.value = data.value;
            this.numberOfPlays = data.numberOfPlays;
            this.offline = data.offline;
        }
    }
};
__decorate([
    core_1.PrimaryKey({ fieldName: '_id' }),
    __metadata("design:type", String)
], MikroTelemetryLog.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroTelemetryLog.prototype, "telemetryBoardId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroTelemetryLog.prototype, "machineId", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroTelemetryLog.prototype, "pointOfSaleId", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroTelemetryLog.prototype, "routeId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroTelemetryLog.prototype, "groupId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroTelemetryLog.prototype, "value", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Date)
], MikroTelemetryLog.prototype, "date", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroTelemetryLog.prototype, "pin", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroTelemetryLog.prototype, "type", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Boolean)
], MikroTelemetryLog.prototype, "maintenance", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", Number)
], MikroTelemetryLog.prototype, "numberOfPlays", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Boolean)
], MikroTelemetryLog.prototype, "offline", void 0);
MikroTelemetryLog = __decorate([
    core_1.Entity({ collection: 'telemetry-logs' }),
    __metadata("design:paramtypes", [Object])
], MikroTelemetryLog);
exports.default = MikroTelemetryLog;
