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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notifications_repostory_1 = __importDefault(require("../../../contracts/repositories/notifications.repostory"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const create_notification_dto_1 = __importDefault(require("../../../contracts/dtos/create-notification.dto"));
const find_notifications_dto_1 = __importDefault(require("../../../contracts/dtos/find-notifications.dto"));
const mikro_notification_1 = __importDefault(require("../entities/mikro-notification"));
const notification_1 = __importDefault(require("../../../contracts/entities/notification"));
const notification_mapper_1 = __importDefault(require("../mappers/notification.mapper"));
let MikroNotificationsRepository = class MikroNotificationsRepository {
    constructor(ormProvider) {
        this.ormProvider = ormProvider;
        this.repository = this.ormProvider.entityManager.getRepository(mikro_notification_1.default);
    }
    create(data) {
        const mikroNotification = new mikro_notification_1.default(data);
        this.repository.persist(mikroNotification);
        return notification_mapper_1.default.toApi(mikroNotification);
    }
    async find({ userId, limit, offset, }) {
        const notifications = await this.repository.find({
            receivers: userId,
        }, {
            limit,
            offset,
        });
        return notifications.map(notification => notification_mapper_1.default.toApi(notification));
    }
    save(data) {
        const notification = notification_mapper_1.default.toOrm(data);
        this.repository.persist(notification);
    }
};
MikroNotificationsRepository = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [mikro_orm_provider_1.default])
], MikroNotificationsRepository);
exports.default = MikroNotificationsRepository;
