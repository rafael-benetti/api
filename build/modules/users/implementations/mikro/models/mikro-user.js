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
const user_1 = __importDefault(require("../../../contracts/models/user"));
const role_1 = __importDefault(require("../../../contracts/enums/role"));
const operator_stock_1 = __importDefault(require("../../../contracts/models/operator-stock"));
const permissions_1 = __importDefault(require("../../../contracts/models/permissions"));
const photo_1 = __importDefault(require("../../../contracts/models/photo"));
const create_user_dto_1 = __importDefault(require("../../../contracts/dtos/create-user.dto"));
const uuid_1 = require("uuid");
let MikroUser = class MikroUser {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.email = data.email;
            this.password = data.password;
            this.name = data.name;
            this.role = data.role;
            this.groupIds = data.groupIds;
            this.permissions = data.permissions;
            this.stock = data.stock;
            this.photo = data.photo;
            this.phoneNumber = data.phoneNumber;
            this.isActive = data.isActive;
            this.ownerId = data.ownerId;
            this.deviceToken = data.deviceToken;
            this.type = data.type;
            this.stateRegistration = data.stateRegistration;
            this.document = data.deviceToken;
            this.subscriptionPrice = data.subscriptionPrice;
            this.subscriptionExpirationDate = data.subscriptionExpirationDate;
        }
    }
};
__decorate([
    core_1.PrimaryKey({ name: '_id' }),
    __metadata("design:type", String)
], MikroUser.prototype, "id", void 0);
__decorate([
    core_1.Property({ unique: true }),
    __metadata("design:type", String)
], MikroUser.prototype, "email", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroUser.prototype, "password", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroUser.prototype, "name", void 0);
__decorate([
    core_1.Enum(() => role_1.default),
    __metadata("design:type", String)
], MikroUser.prototype, "role", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Array)
], MikroUser.prototype, "groupIds", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], MikroUser.prototype, "permissions", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], MikroUser.prototype, "stock", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Object)
], MikroUser.prototype, "photo", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroUser.prototype, "phoneNumber", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Boolean)
], MikroUser.prototype, "isActive", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroUser.prototype, "ownerId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroUser.prototype, "deviceToken", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroUser.prototype, "type", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroUser.prototype, "stateRegistration", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroUser.prototype, "document", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroUser.prototype, "subscriptionPrice", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Date)
], MikroUser.prototype, "subscriptionExpirationDate", void 0);
MikroUser = __decorate([
    core_1.Entity({ collection: 'users' }),
    __metadata("design:paramtypes", [Object])
], MikroUser);
exports.default = MikroUser;
