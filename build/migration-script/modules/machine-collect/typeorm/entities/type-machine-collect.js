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
const type_machine_collect_counter_1 = __importDefault(require("./type-machine-collect-counter"));
let TypeMachineCollect = class TypeMachineCollect {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], TypeMachineCollect.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'machine_id' }),
    __metadata("design:type", Number)
], TypeMachineCollect.prototype, "machineId", void 0);
__decorate([
    typeorm_1.Column({ name: 'collection_date', type: 'datetime' }),
    __metadata("design:type", Date)
], TypeMachineCollect.prototype, "collectionDate", void 0);
__decorate([
    typeorm_1.Column({ name: 'user_id' }),
    __metadata("design:type", Number)
], TypeMachineCollect.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ name: 'previous_collection_id' }),
    __metadata("design:type", Number)
], TypeMachineCollect.prototype, "previousCollectionId", void 0);
__decorate([
    typeorm_1.OneToMany(() => type_machine_collect_counter_1.default, counter => counter.machineCollect),
    __metadata("design:type", Array)
], TypeMachineCollect.prototype, "counters", void 0);
TypeMachineCollect = __decorate([
    typeorm_1.Entity('machine_collect')
], TypeMachineCollect);
exports.default = TypeMachineCollect;
