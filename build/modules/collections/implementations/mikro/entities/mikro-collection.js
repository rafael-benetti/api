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
const create_collection_dto_1 = __importDefault(require("../../../contracts/dtos/create-collection.dto"));
const collection_1 = __importDefault(require("../../../contracts/entities/collection"));
const box_collection_1 = __importDefault(require("../../../contracts/interfaces/box-collection"));
const mikro_group_1 = __importDefault(require("../../../../groups/implementations/mikro/models/mikro-group"));
const mikro_machine_1 = __importDefault(require("../../../../machines/implementations/mikro/models/mikro-machine"));
const mikro_point_of_sale_1 = __importDefault(require("../../../../points-of-sale/implementations/mikro/models/mikro-point-of-sale"));
const mikro_route_1 = __importDefault(require("../../../../routes/implementations/mikro/models/mikro-route"));
const mikro_user_1 = __importDefault(require("../../../../users/implementations/mikro/models/mikro-user"));
const uuid_1 = require("uuid");
const geolocation_dto_1 = __importDefault(require("../../../contracts/dtos/geolocation.dto"));
let MikroCollection = class MikroCollection {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.previousCollectionId = data.previousCollectionId;
            this.machineId = data.machineId;
            this.groupId = data.groupId;
            this.userId = data.userId;
            this.pointOfSaleId = data.pointOfSaleId;
            this.routeId = data.routeId;
            if (data.date === undefined) {
                this.date = new Date();
            }
            else {
                this.date = data.date;
            }
            this.observations = data.observations;
            this.boxCollections = data.boxCollections;
            this.startLocation = data.startLocation;
            this.endLocation = data.endLocation;
            this.startTime = data.startTime;
            this.reviewedData = data.reviewedData;
        }
    }
};
__decorate([
    core_1.PrimaryKey({ fieldName: '_id' }),
    __metadata("design:type", String)
], MikroCollection.prototype, "id", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroCollection.prototype, "previousCollectionId", void 0);
__decorate([
    core_1.OneToOne({ name: 'previousCollectionId' }),
    __metadata("design:type", MikroCollection)
], MikroCollection.prototype, "previousCollection", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroCollection.prototype, "machineId", void 0);
__decorate([
    core_1.OneToOne({ name: 'machineId' }),
    __metadata("design:type", mikro_machine_1.default)
], MikroCollection.prototype, "machine", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroCollection.prototype, "groupId", void 0);
__decorate([
    core_1.OneToOne({ name: 'groupId' }),
    __metadata("design:type", mikro_group_1.default)
], MikroCollection.prototype, "group", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroCollection.prototype, "userId", void 0);
__decorate([
    core_1.OneToOne({ name: 'userId' }),
    __metadata("design:type", mikro_user_1.default)
], MikroCollection.prototype, "user", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroCollection.prototype, "pointOfSaleId", void 0);
__decorate([
    core_1.OneToOne({ name: 'pointOfSaleId', nullable: true }),
    __metadata("design:type", mikro_point_of_sale_1.default)
], MikroCollection.prototype, "pointOfSale", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroCollection.prototype, "routeId", void 0);
__decorate([
    core_1.OneToOne({ name: 'routeId', nullable: true }),
    __metadata("design:type", mikro_route_1.default)
], MikroCollection.prototype, "route", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroCollection.prototype, "observations", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Date)
], MikroCollection.prototype, "date", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Array)
], MikroCollection.prototype, "boxCollections", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Date)
], MikroCollection.prototype, "startTime", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", Object)
], MikroCollection.prototype, "startLocation", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", Object)
], MikroCollection.prototype, "endLocation", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", Object)
], MikroCollection.prototype, "reviewedData", void 0);
MikroCollection = __decorate([
    core_1.Entity({ collection: 'collections' }),
    __metadata("design:paramtypes", [Object])
], MikroCollection);
exports.default = MikroCollection;
