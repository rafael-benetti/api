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
const mikro_point_of_sale_1 = __importDefault(require("../../../../points-of-sale/implementations/mikro/models/mikro-point-of-sale"));
const create_route_dto_1 = __importDefault(require("../../../contracts/dtos/create-route.dto"));
const uuid_1 = require("uuid");
const route_1 = __importDefault(require("../../../contracts/models/route"));
let MikroRoute = class MikroRoute {
    constructor(data) {
        if (data) {
            this.id = data.id || uuid_1.v4();
            this.label = data.label;
            this.pointsOfSaleIds = data.pointsOfSaleIds;
            this.operatorId = data.operatorId;
            this.ownerId = data.ownerId;
            this.groupIds = data.groupIds;
        }
    }
};
__decorate([
    core_1.PrimaryKey({ fieldName: '_id' }),
    __metadata("design:type", String)
], MikroRoute.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroRoute.prototype, "label", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroRoute.prototype, "operatorId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Array)
], MikroRoute.prototype, "groupIds", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Array)
], MikroRoute.prototype, "pointsOfSaleIds", void 0);
__decorate([
    core_1.OneToMany({
        entity: () => mikro_point_of_sale_1.default,
        mappedBy: p => p.route,
    }),
    __metadata("design:type", Array)
], MikroRoute.prototype, "pointsOfSale", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroRoute.prototype, "ownerId", void 0);
MikroRoute = __decorate([
    core_1.Entity({ collection: 'routes' }),
    __metadata("design:paramtypes", [Object])
], MikroRoute);
exports.default = MikroRoute;
