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
/* eslint-disable import/no-extraneous-dependencies */
const typeorm_1 = require("typeorm");
const type_selling_point_1 = __importDefault(require("./type-selling-point"));
let TypeAddress = class TypeAddress {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], TypeAddress.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'zip_code' }),
    __metadata("design:type", String)
], TypeAddress.prototype, "zipCode", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TypeAddress.prototype, "state", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TypeAddress.prototype, "city", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TypeAddress.prototype, "neighborhood", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TypeAddress.prototype, "street", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TypeAddress.prototype, "number", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TypeAddress.prototype, "note", void 0);
__decorate([
    typeorm_1.OneToOne(() => type_selling_point_1.default, {
        cascade: ['insert', 'update', 'remove'],
    }),
    __metadata("design:type", type_selling_point_1.default)
], TypeAddress.prototype, "sellingPoint", void 0);
TypeAddress = __decorate([
    typeorm_1.Entity('address')
], TypeAddress);
exports.default = TypeAddress;
