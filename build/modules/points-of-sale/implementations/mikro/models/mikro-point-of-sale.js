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
const create_point_of_sale_dto_1 = __importDefault(require("../../../contracts/dtos/create-point-of-sale.dto"));
const address_1 = __importDefault(require("../../../contracts/models/address"));
const point_of_sale_1 = __importDefault(require("../../../contracts/models/point-of-sale"));
const mikro_route_1 = __importDefault(require("../../../../routes/implementations/mikro/models/mikro-route"));
const uuid_1 = require("uuid");
let MikroPointOfSale = class MikroPointOfSale {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.ownerId = data.ownerId;
            this.groupId = data.groupId;
            this.label = data.label;
            this.contactName = data.contactName;
            this.primaryPhoneNumber = data.primaryPhoneNumber;
            this.secondaryPhoneNumber = data.secondaryPhoneNumber;
            this.rent = data.rent;
            this.isPercentage = data.isPercentage;
            this.address = data.address;
        }
    }
};
__decorate([
    core_1.PrimaryKey({ fieldName: '_id' }),
    __metadata("design:type", String)
], MikroPointOfSale.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroPointOfSale.prototype, "ownerId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroPointOfSale.prototype, "groupId", void 0);
__decorate([
    core_1.OneToOne({ name: 'groupId' }),
    __metadata("design:type", mikro_group_1.default)
], MikroPointOfSale.prototype, "group", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroPointOfSale.prototype, "routeId", void 0);
__decorate([
    core_1.ManyToOne(() => mikro_route_1.default),
    __metadata("design:type", mikro_route_1.default)
], MikroPointOfSale.prototype, "route", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroPointOfSale.prototype, "label", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroPointOfSale.prototype, "contactName", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroPointOfSale.prototype, "primaryPhoneNumber", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroPointOfSale.prototype, "secondaryPhoneNumber", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroPointOfSale.prototype, "rent", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Boolean)
], MikroPointOfSale.prototype, "isPercentage", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], MikroPointOfSale.prototype, "address", void 0);
MikroPointOfSale = __decorate([
    core_1.Entity({ collection: 'points-of-sale' }),
    __metadata("design:paramtypes", [Object])
], MikroPointOfSale);
exports.default = MikroPointOfSale;
