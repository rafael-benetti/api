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
let MikroNotification = class MikroNotification {
    constructor(data) {
        if (data) {
            this.title = data.title;
            this.message = data.message;
            this.receivers = data.receivers;
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
    __metadata("design:type", String)
], MikroNotification.prototype, "message", void 0);
__decorate([
    core_1.Property(),
    __metadata("design:type", Array)
], MikroNotification.prototype, "receivers", void 0);
MikroNotification = __decorate([
    core_1.Entity({ collection: 'notifications' }),
    __metadata("design:paramtypes", [Object])
], MikroNotification);
exports.default = MikroNotification;
