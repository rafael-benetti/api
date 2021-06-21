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
let TypeMachineCollectCounterPhoto = class TypeMachineCollectCounterPhoto {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], TypeMachineCollectCounterPhoto.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'machine_collect_counter_id' }),
    __metadata("design:type", Number)
], TypeMachineCollectCounterPhoto.prototype, "machineCollectCounterId", void 0);
__decorate([
    typeorm_1.Column({ name: 'photo' }),
    __metadata("design:type", String)
], TypeMachineCollectCounterPhoto.prototype, "photo", void 0);
__decorate([
    typeorm_1.Column({ name: 'counter_id' }),
    __metadata("design:type", Number)
], TypeMachineCollectCounterPhoto.prototype, "counterId", void 0);
__decorate([
    typeorm_1.Column({ name: 'machine_collect_id' }),
    __metadata("design:type", Number)
], TypeMachineCollectCounterPhoto.prototype, "machineCollectId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => type_machine_collect_counter_1.default, machineCollectCounter => machineCollectCounter.photos),
    typeorm_1.JoinColumn({ name: 'machine_collect_counter_id' }),
    __metadata("design:type", type_machine_collect_counter_1.default)
], TypeMachineCollectCounterPhoto.prototype, "machineCollectCounter", void 0);
TypeMachineCollectCounterPhoto = __decorate([
    typeorm_1.Entity('machine_collect_counter_photo')
], TypeMachineCollectCounterPhoto);
exports.default = TypeMachineCollectCounterPhoto;
