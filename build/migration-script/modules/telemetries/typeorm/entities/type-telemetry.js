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
let TypeTelemetry = class TypeTelemetry {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], TypeTelemetry.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'company_id' }),
    __metadata("design:type", Number)
], TypeTelemetry.prototype, "companyId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TypeTelemetry.prototype, "iccid", void 0);
__decorate([
    typeorm_1.Column({ name: 'last_communication' }),
    __metadata("design:type", Date)
], TypeTelemetry.prototype, "lastCommunication", void 0);
__decorate([
    typeorm_1.Column({ name: 'connection_type' }),
    __metadata("design:type", String)
], TypeTelemetry.prototype, "connectionType", void 0);
TypeTelemetry = __decorate([
    typeorm_1.Entity('telemetry')
], TypeTelemetry);
exports.default = TypeTelemetry;
