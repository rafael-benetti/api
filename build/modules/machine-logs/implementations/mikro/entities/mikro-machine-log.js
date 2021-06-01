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
const create_machine_log_dto_1 = __importDefault(require("../../../contracts/dtos/create-machine-log.dto"));
const machine_log_1 = __importDefault(require("../../../contracts/entities/machine-log"));
const machine_log_type_1 = __importDefault(require("../../../contracts/enums/machine-log-type"));
const uuid_1 = require("uuid");
let MikroMachineLog = class MikroMachineLog {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.createdAt = new Date();
            this.createdBy = data.createdBy;
            this.observations = data.observations;
            this.type = data.type;
            this.machineId = data.machineId;
            this.groupId = data.groupId;
            this.quantity = data.quantity;
        }
    }
};
__decorate([
    core_1.PrimaryKey(),
    __metadata("design:type", String)
], MikroMachineLog.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroMachineLog.prototype, "machineId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroMachineLog.prototype, "groupId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroMachineLog.prototype, "observations", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroMachineLog.prototype, "type", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Date)
], MikroMachineLog.prototype, "createdAt", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroMachineLog.prototype, "createdBy", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroMachineLog.prototype, "quantity", void 0);
MikroMachineLog = __decorate([
    core_1.Entity({ collection: 'machine-logs' }),
    __metadata("design:paramtypes", [Object])
], MikroMachineLog);
exports.default = MikroMachineLog;
