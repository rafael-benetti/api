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
let TypeCounter = class TypeCounter {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], TypeCounter.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], TypeCounter.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Number)
], TypeCounter.prototype, "slot", void 0);
__decorate([
    typeorm_1.Column({ name: 'has_digital', nullable: false }),
    __metadata("design:type", Number)
], TypeCounter.prototype, "hasDigital", void 0);
__decorate([
    typeorm_1.Column({ name: 'has_mechanical', nullable: false }),
    __metadata("design:type", Number)
], TypeCounter.prototype, "hasMechanical", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TypeCounter.prototype, "pin", void 0);
__decorate([
    typeorm_1.Column({
        name: 'pulse_value',
    }),
    __metadata("design:type", Number)
], TypeCounter.prototype, "pulseValue", void 0);
__decorate([
    typeorm_1.Column({ name: 'machine_id' }),
    __metadata("design:type", Number)
], TypeCounter.prototype, "machineId", void 0);
__decorate([
    typeorm_1.Column({ name: 'type_id' }),
    __metadata("design:type", Number)
], TypeCounter.prototype, "typeId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => type_machine_1.default, machine => machine.counters, {
        cascade: ['insert', 'update', 'remove'],
        orphanedRowAction: 'delete',
    }),
    typeorm_1.JoinColumn({ name: 'machine_id' }),
    __metadata("design:type", type_machine_1.default)
], TypeCounter.prototype, "machine", void 0);
__decorate([
    typeorm_1.Column({ name: 'counter_group_id' }),
    __metadata("design:type", Number)
], TypeCounter.prototype, "counterGroupId", void 0);
TypeCounter = __decorate([
    typeorm_1.Entity('counter')
], TypeCounter);
exports.default = TypeCounter;
