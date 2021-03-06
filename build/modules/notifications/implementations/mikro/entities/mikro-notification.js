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
const create_notification_dto_1 = __importDefault(require("../../../contracts/dtos/create-notification.dto"));
const notification_1 = __importDefault(require("../../../contracts/entities/notification"));
const uuid_1 = require("uuid");
let MikroNotification = class MikroNotification {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.title = data.title;
            this.body = data.body;
            this.groupId = data.groupId;
            this.receivers = data.receivers;
            this.machineId = data.machineId;
            this.date = new Date();
            this.isRead = false;
        }
    }
};
__decorate([
    core_1.PrimaryKey({ name: '_id' }),
    __metadata("design:type", String)
], MikroNotification.prototype, "id", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroNotification.prototype, "title", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Array)
], MikroNotification.prototype, "receivers", void 0);
__decorate([
    core_1.Property({ nullable: true }),
    __metadata("design:type", String)
], MikroNotification.prototype, "machineId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroNotification.prototype, "body", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", String)
], MikroNotification.prototype, "groupId", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Date)
], MikroNotification.prototype, "date", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Boolean)
], MikroNotification.prototype, "isRead", void 0);
MikroNotification = __decorate([
    core_1.Entity({ collection: 'notifications' }),
    __metadata("design:paramtypes", [Object])
], MikroNotification);
exports.default = MikroNotification;
