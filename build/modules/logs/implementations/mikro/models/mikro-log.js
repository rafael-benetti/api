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
const mikro_collection_1 = __importDefault(require("../../../../collections/implementations/mikro/entities/mikro-collection"));
const mikro_group_1 = __importDefault(require("../../../../groups/implementations/mikro/models/mikro-group"));
const create_log_dto_1 = __importDefault(require("../../../contracts/dtos/create-log.dto"));
const log_type_enum_1 = __importDefault(require("../../../contracts/enums/log-type.enum"));
const log_1 = __importDefault(require("../../../contracts/models/log"));
const mikro_machine_1 = __importDefault(require("../../../../machines/implementations/mikro/models/mikro-machine"));
const mikro_point_of_sale_1 = __importDefault(require("../../../../points-of-sale/implementations/mikro/models/mikro-point-of-sale"));
const mikro_route_1 = __importDefault(require("../../../../routes/implementations/mikro/models/mikro-route"));
const mikro_user_1 = __importDefault(require("../../../../users/implementations/mikro/models/mikro-user"));
const uuid_1 = require("uuid");
let MikroLog = class MikroLog {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.createdBy = data.createdBy;
            this.ownerId = data.ownerId;
            this.groupId = data.groupId;
            this.type = data.type;
            this.quantity = data?.quantity;
            this.destinationId = data?.destinationId;
            this.machineId = data?.machineId;
            this.affectedGroupId = data?.affectedGroupId;
            this.posId = data?.posId;
            this.routeId = data?.routeId;
            this.userId = data?.userId;
            this.collectionId = data?.collectionId;
            this.productName = data?.productName;
            this.createdAt = new Date();
        }
    }
};
__decorate([
    core_1.PrimaryKey({ fieldName: '_id' }),
    __metadata("design:type", String)
], MikroLog.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroLog.prototype, "createdBy", void 0);
__decorate([
    core_1.OneToOne({ name: 'createdBy' }),
    __metadata("design:type", mikro_user_1.default)
], MikroLog.prototype, "createdByUser", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroLog.prototype, "ownerId", void 0);
__decorate([
    core_1.OneToOne({ name: 'ownerId' }),
    __metadata("design:type", mikro_user_1.default)
], MikroLog.prototype, "owner", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroLog.prototype, "groupId", void 0);
__decorate([
    core_1.OneToOne({ name: 'groupId' }),
    __metadata("design:type", mikro_group_1.default)
], MikroLog.prototype, "group", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroLog.prototype, "type", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", Number)
], MikroLog.prototype, "quantity", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroLog.prototype, "destinationId", void 0);
__decorate([
    core_1.OneToOne({ name: 'destinationId', nullable: true }),
    __metadata("design:type", mikro_point_of_sale_1.default)
], MikroLog.prototype, "destination", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroLog.prototype, "machineId", void 0);
__decorate([
    core_1.OneToOne({ name: 'machineId', nullable: true }),
    __metadata("design:type", mikro_machine_1.default)
], MikroLog.prototype, "machine", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroLog.prototype, "affectedGroupId", void 0);
__decorate([
    core_1.OneToOne({ name: 'affectedGroupId', nullable: true }),
    __metadata("design:type", mikro_group_1.default)
], MikroLog.prototype, "affectedGroup", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroLog.prototype, "posId", void 0);
__decorate([
    core_1.OneToOne({ name: 'posId', nullable: true }),
    __metadata("design:type", mikro_point_of_sale_1.default)
], MikroLog.prototype, "pos", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroLog.prototype, "routeId", void 0);
__decorate([
    core_1.OneToOne({ name: 'routeId', nullable: true }),
    __metadata("design:type", mikro_route_1.default)
], MikroLog.prototype, "route", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroLog.prototype, "userId", void 0);
__decorate([
    core_1.OneToOne({ name: 'userId', nullable: true }),
    __metadata("design:type", mikro_user_1.default)
], MikroLog.prototype, "user", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroLog.prototype, "collectionId", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroLog.prototype, "productName", void 0);
__decorate([
    core_1.OneToOne({ name: 'collectionId', nullable: true }),
    __metadata("design:type", mikro_collection_1.default)
], MikroLog.prototype, "collection", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Date)
], MikroLog.prototype, "createdAt", void 0);
MikroLog = __decorate([
    core_1.Entity({ collection: 'logs' }),
    __metadata("design:paramtypes", [Object])
], MikroLog);
exports.default = MikroLog;
