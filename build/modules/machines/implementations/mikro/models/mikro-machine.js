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
const create_machine_dto_1 = __importDefault(require("../../../contracts/dtos/create-machine.dto"));
const box_1 = __importDefault(require("../../../contracts/models/box"));
const machine_1 = __importDefault(require("../../../contracts/models/machine"));
const mikro_point_of_sale_1 = __importDefault(require("../../../../points-of-sale/implementations/mikro/models/mikro-point-of-sale"));
const mikro_telemetry_board_1 = __importDefault(require("../../../../telemetry/implementations/mikro/entities/mikro-telemetry-board"));
const mikro_user_1 = __importDefault(require("../../../../users/implementations/mikro/models/mikro-user"));
const uuid_1 = require("uuid");
let MikroMachine = class MikroMachine {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.categoryId = data.categoryId;
            this.boxes = data.boxes;
            this.groupId = data.groupId;
            this.serialNumber = data.serialNumber;
            this.gameValue = data.gameValue;
            this.operatorId = data.operatorId;
            this.locationId = data.locationId;
            this.ownerId = data.ownerId;
            this.categoryLabel = data.categoryLabel;
            this.isActive = data.isActive;
            this.telemetryBoardId = data.telemetryBoardId;
            this.maintenance = false;
            this.typeOfPrize = data.typeOfPrize;
            this.minimumPrizeCount = data.minimumPrizeCount;
            this.incomePerMonthGoal = data.incomePerMonthGoal;
            this.incomePerPrizeGoal = data.incomePerPrizeGoal;
        }
    }
};
__decorate([
    core_1.PrimaryKey({ fieldName: '_id' }),
    __metadata("design:type", String)
], MikroMachine.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroMachine.prototype, "categoryId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Array)
], MikroMachine.prototype, "boxes", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroMachine.prototype, "groupId", void 0);
__decorate([
    core_1.OneToOne({ name: 'groupId' }),
    __metadata("design:type", mikro_group_1.default)
], MikroMachine.prototype, "group", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroMachine.prototype, "telemetryBoardId", void 0);
__decorate([
    core_1.OneToOne(() => mikro_telemetry_board_1.default, mikroTelemetryBoard => mikroTelemetryBoard.machine, {
        name: 'telemetryBoardId',
    }),
    __metadata("design:type", mikro_telemetry_board_1.default)
], MikroMachine.prototype, "telemetryBoard", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroMachine.prototype, "serialNumber", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroMachine.prototype, "gameValue", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroMachine.prototype, "operatorId", void 0);
__decorate([
    core_1.OneToOne({ name: 'operatorId' }),
    __metadata("design:type", mikro_user_1.default)
], MikroMachine.prototype, "operator", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroMachine.prototype, "locationId", void 0);
__decorate([
    core_1.OneToOne({ name: 'locationId' }),
    __metadata("design:type", mikro_point_of_sale_1.default)
], MikroMachine.prototype, "pointOfSale", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroMachine.prototype, "ownerId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroMachine.prototype, "categoryLabel", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Boolean)
], MikroMachine.prototype, "isActive", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Boolean)
], MikroMachine.prototype, "maintenance", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroMachine.prototype, "minimumPrizeCount", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], MikroMachine.prototype, "typeOfPrize", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Date)
], MikroMachine.prototype, "lastConnection", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Date)
], MikroMachine.prototype, "lastCollection", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroMachine.prototype, "incomePerPrizeGoal", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroMachine.prototype, "incomePerMonthGoal", void 0);
MikroMachine = __decorate([
    core_1.Entity({ collection: 'machines' }),
    __metadata("design:paramtypes", [Object])
], MikroMachine);
exports.default = MikroMachine;
