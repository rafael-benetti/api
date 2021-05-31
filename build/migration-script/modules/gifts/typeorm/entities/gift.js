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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
const typeorm_1 = require("typeorm");
let TypeGift = class TypeGift {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], TypeGift.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'telemetry_id' }),
    __metadata("design:type", Number)
], TypeGift.prototype, "telemetryId", void 0);
__decorate([
    typeorm_1.Column({ name: 'machine_id' }),
    __metadata("design:type", Number)
], TypeGift.prototype, "machineId", void 0);
__decorate([
    typeorm_1.Column({ name: 'selling_point_id' }),
    __metadata("design:type", Number)
], TypeGift.prototype, "sellingPointId", void 0);
__decorate([
    typeorm_1.Column({ name: 'quantity' }),
    __metadata("design:type", Number)
], TypeGift.prototype, "value", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], TypeGift.prototype, "date", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TypeGift.prototype, "pin", void 0);
TypeGift = __decorate([
    typeorm_1.Entity('gift')
], TypeGift);
exports.default = TypeGift;
