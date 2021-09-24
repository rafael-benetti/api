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
const mikro_group_1 = __importDefault(require("../../../../groups/implementations/mikro/models/mikro-group"));
const mikro_machine_1 = __importDefault(require("../../../../machines/implementations/mikro/models/mikro-machine"));
const create_telemetry_board_dto_1 = __importDefault(require("../../../contracts/dtos/create-telemetry-board.dto"));
const telemetry_board_1 = __importDefault(require("../../../contracts/entities/telemetry-board"));
const mikro_user_1 = __importDefault(require("../../../../users/implementations/mikro/models/mikro-user"));
let MikroTelemetryBoard = class MikroTelemetryBoard {
    constructor(data) {
        if (data) {
            this.ownerId = data.ownerId;
            this.groupId = data.groupId;
            this.integratedCircuitCardId = data.integratedCircuitCardId;
            this.connectionStrength = data.connectionStrength;
            this.connectionType = data.connectionType;
            this.lastConnection = data.lastConnection;
            this.machineId = data.machineId;
        }
    }
};
__decorate([
    core_1.PrimaryKey({ name: '_id' }),
    __metadata("design:type", Number)
], MikroTelemetryBoard.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroTelemetryBoard.prototype, "ownerId", void 0);
__decorate([
    core_1.OneToOne({ name: 'ownerId', nullable: true }),
    __metadata("design:type", mikro_user_1.default)
], MikroTelemetryBoard.prototype, "owner", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroTelemetryBoard.prototype, "groupId", void 0);
__decorate([
    core_1.OneToOne({ name: 'groupId', nullable: true }),
    __metadata("design:type", mikro_group_1.default)
], MikroTelemetryBoard.prototype, "group", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroTelemetryBoard.prototype, "integratedCircuitCardId", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroTelemetryBoard.prototype, "machineId", void 0);
__decorate([
    core_1.OneToOne(() => mikro_machine_1.default, mikroMachine => mikroMachine.telemetryBoard, {
        owner: true,
        orphanRemoval: true,
        name: 'machineId',
    }),
    __metadata("design:type", mikro_machine_1.default)
], MikroTelemetryBoard.prototype, "machine", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", Date)
], MikroTelemetryBoard.prototype, "lastConnection", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroTelemetryBoard.prototype, "connectionStrength", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroTelemetryBoard.prototype, "connectionType", void 0);
MikroTelemetryBoard = __decorate([
    core_1.Entity({ collection: 'telemetry-boards' }),
    __metadata("design:paramtypes", [Object])
], MikroTelemetryBoard);
exports.default = MikroTelemetryBoard;
