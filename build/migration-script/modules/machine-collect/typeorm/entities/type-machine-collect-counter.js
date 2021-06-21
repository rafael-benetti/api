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
const type_machine_collect_1 = __importDefault(require("./type-machine-collect"));
const type_machine_collect_counter_photo_1 = __importDefault(require("./type-machine-collect-counter-photo"));
let TypeMachineCollectCounter = class TypeMachineCollectCounter {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], TypeMachineCollectCounter.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'machine_collect_id' }),
    __metadata("design:type", Number)
], TypeMachineCollectCounter.prototype, "machineCollectId", void 0);
__decorate([
    typeorm_1.Column({ name: 'counter_id' }),
    __metadata("design:type", Number)
], TypeMachineCollectCounter.prototype, "counterId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TypeMachineCollectCounter.prototype, "quantity", void 0);
__decorate([
    typeorm_1.Column({ name: 'is_mechanical', type: 'tinyint' }),
    __metadata("design:type", Number)
], TypeMachineCollectCounter.prototype, "isMechanical", void 0);
__decorate([
    typeorm_1.Column({ name: 'is_digital', type: 'tinyint' }),
    __metadata("design:type", Number)
], TypeMachineCollectCounter.prototype, "isDigital", void 0);
__decorate([
    typeorm_1.Column({ name: 'is_counted', type: 'tinyint' }),
    __metadata("design:type", Number)
], TypeMachineCollectCounter.prototype, "isCounted", void 0);
__decorate([
    typeorm_1.ManyToOne(() => type_machine_collect_1.default, machineCollect => machineCollect.counters),
    typeorm_1.JoinColumn({ name: 'machine_collect_id' }),
    __metadata("design:type", type_machine_collect_1.default)
], TypeMachineCollectCounter.prototype, "machineCollect", void 0);
__decorate([
    typeorm_1.OneToMany(() => type_machine_collect_counter_photo_1.default, photo => photo.machineCollectCounter, {
        cascade: ['insert', 'update'],
    }),
    __metadata("design:type", Array)
], TypeMachineCollectCounter.prototype, "photos", void 0);
TypeMachineCollectCounter = __decorate([
    typeorm_1.Entity('machine_collect_counter')
], TypeMachineCollectCounter);
exports.default = TypeMachineCollectCounter;
