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
const create_product_log_dto_1 = __importDefault(require("../../../contracts/dtos/create-product-log.dto"));
const product_log_1 = __importDefault(require("../../../contracts/entities/product-log"));
const uuid_1 = require("uuid");
let MikroProductLog = class MikroProductLog {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.groupId = data.groupId;
            this.productName = data.productName;
            this.productType = data.productType;
            this.quantity = data.quantity;
            this.logType = data.logType;
            this.cost = data.cost;
            this.createdAt = new Date();
        }
    }
};
__decorate([
    core_1.PrimaryKey({ name: '_id' }),
    __metadata("design:type", String)
], MikroProductLog.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroProductLog.prototype, "groupId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroProductLog.prototype, "productName", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroProductLog.prototype, "productType", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroProductLog.prototype, "quantity", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroProductLog.prototype, "logType", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Number)
], MikroProductLog.prototype, "cost", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Date)
], MikroProductLog.prototype, "createdAt", void 0);
MikroProductLog = __decorate([
    core_1.Entity({ collection: 'product-logs' }),
    __metadata("design:paramtypes", [Object])
], MikroProductLog);
exports.default = MikroProductLog;
