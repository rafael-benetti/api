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
const type_machine_1 = __importDefault(require("../../../machines/typeorm/entities/type-machine"));
const typeorm_1 = require("typeorm");
const type_address_1 = __importDefault(require("./type-address"));
let TypeSellingPoint = class TypeSellingPoint {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], TypeSellingPoint.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'address_id' }),
    __metadata("design:type", Number)
], TypeSellingPoint.prototype, "addressId", void 0);
__decorate([
    typeorm_1.Column({ name: 'company_id' }),
    __metadata("design:type", Number)
], TypeSellingPoint.prototype, "companyId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TypeSellingPoint.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TypeSellingPoint.prototype, "responsible", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TypeSellingPoint.prototype, "phone1", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], TypeSellingPoint.prototype, "phone2", void 0);
__decorate([
    typeorm_1.OneToMany(() => type_machine_1.default, machine => machine.sellingPoint),
    __metadata("design:type", Array)
], TypeSellingPoint.prototype, "machines", void 0);
__decorate([
    typeorm_1.OneToOne(() => type_address_1.default, {
        cascade: ['insert', 'update'],
    }),
    typeorm_1.JoinColumn({ name: 'address_id' }),
    __metadata("design:type", type_address_1.default)
], TypeSellingPoint.prototype, "address", void 0);
TypeSellingPoint = __decorate([
    typeorm_1.Entity('selling_point')
], TypeSellingPoint);
exports.default = TypeSellingPoint;
