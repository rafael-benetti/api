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
// import Company from '@modules/companies/infra/typeorm/entities/Company';
// import Counter from '@modules/counters/infra/typeorm/entities/Counter';
// import MachineCollect from '@modules/machine_collection/infra/typeorm/entities/MachineCollect';
// import SellingPoint from '@modules/sellingPoints/infra/typeorm/entities/SellingPoint';
// import TypeormNumberTransformer from '@shared/utils/TypeormNumberTransformer';
const type_counters_1 = __importDefault(require("../../../counters/typeorm/entities/type-counters"));
const type_selling_point_1 = __importDefault(require("../../../selling-points/typeorm/entities/type-selling-point"));
const typeorm_1 = require("typeorm");
// import MachineCategory from './MachineCategory';
let TypeMachine = class TypeMachine {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], TypeMachine.prototype, "id", void 0);
__decorate([
    typeorm_1.Index({ fulltext: true }),
    typeorm_1.Column({ name: 'serial_number' }),
    __metadata("design:type", String)
], TypeMachine.prototype, "serialNumber", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], TypeMachine.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ name: 'registration_date', type: 'datetime' }),
    __metadata("design:type", Date)
], TypeMachine.prototype, "registrationDate", void 0);
__decorate([
    typeorm_1.Column({ name: 'selling_point_id' }),
    __metadata("design:type", Number)
], TypeMachine.prototype, "sellingPointId", void 0);
__decorate([
    typeorm_1.Column({ name: 'operator_id' }),
    __metadata("design:type", Number)
], TypeMachine.prototype, "operatorId", void 0);
__decorate([
    typeorm_1.Column({ name: 'telemetry_id' }),
    __metadata("design:type", Number)
], TypeMachine.prototype, "telemetryId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => type_selling_point_1.default, sellingPoint => sellingPoint.machines),
    typeorm_1.JoinColumn({ name: 'selling_point_id' }),
    __metadata("design:type", type_selling_point_1.default)
], TypeMachine.prototype, "sellingPoint", void 0);
__decorate([
    typeorm_1.Column({
        name: 'game_value',
        nullable: false,
    }),
    __metadata("design:type", Number)
], TypeMachine.prototype, "gameValue", void 0);
__decorate([
    typeorm_1.Column({
        name: 'last_collection',
        default: () => 'null',
    }),
    __metadata("design:type", Date)
], TypeMachine.prototype, "lastCollection", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinyint', nullable: true, default: 1 }),
    __metadata("design:type", Number)
], TypeMachine.prototype, "active", void 0);
__decorate([
    typeorm_1.Column({ name: 'company_id' }),
    __metadata("design:type", Number)
], TypeMachine.prototype, "companyId", void 0);
__decorate([
    typeorm_1.Column({ name: 'category_id' }),
    __metadata("design:type", Number)
], TypeMachine.prototype, "machineCategoryId", void 0);
__decorate([
    typeorm_1.OneToMany(() => type_counters_1.default, counter => counter.machine, {
        cascade: ['insert', 'update'],
    }),
    __metadata("design:type", Array)
], TypeMachine.prototype, "counters", void 0);
TypeMachine = __decorate([
    typeorm_1.Entity('machine')
], TypeMachine);
exports.default = TypeMachine;
