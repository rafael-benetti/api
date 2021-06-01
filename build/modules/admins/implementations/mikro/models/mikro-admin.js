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
const core_1 = require("@mikro-orm/core");
const create_admin_dto_1 = __importDefault(require("../../../contracts/dtos/create-admin.dto"));
const admin_1 = __importDefault(require("../../../contracts/models/admin"));
const uuid_1 = require("uuid");
let MikroAdmin = class MikroAdmin {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.email = data.email;
            this.password = data.password;
            this.name = data.name;
        }
    }
};
__decorate([
    core_1.PrimaryKey({ name: '_id' }),
    __metadata("design:type", String)
], MikroAdmin.prototype, "id", void 0);
__decorate([
    core_1.Property({ unique: true }),
    __metadata("design:type", String)
], MikroAdmin.prototype, "email", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroAdmin.prototype, "password", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroAdmin.prototype, "name", void 0);
MikroAdmin = __decorate([
    core_1.Entity({ collection: 'admins' }),
    __metadata("design:paramtypes", [Object])
], MikroAdmin);
exports.default = MikroAdmin;
