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
const type_user_1 = __importDefault(require("../../../users/typeorm/entities/type-user"));
const typeorm_1 = require("typeorm");
let Company = class Company {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], Company.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ name: 'owner_id' }),
    __metadata("design:type", Number)
], Company.prototype, "ownerId", void 0);
__decorate([
    typeorm_1.ManyToMany(() => type_user_1.default, user => user.companies, {
        cascade: ['insert', 'update', 'remove'],
    }),
    typeorm_1.JoinTable({
        name: 'user_company',
        joinColumn: {
            name: 'company_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Company.prototype, "users", void 0);
Company = __decorate([
    typeorm_1.Entity('company')
], Company);
exports.default = Company;
