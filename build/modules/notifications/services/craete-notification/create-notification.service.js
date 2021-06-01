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
const notifications_repostory_1 = __importDefault(require("../../contracts/repositories/notifications.repostory"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const notification_provider_1 = __importDefault(require("../../../../providers/notification-provider/contracts/notification.provider"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const tsyringe_1 = require("tsyringe");
let CreateNotificationService = class CreateNotificationService {
    constructor(ormProvider, notificationProvider, usersRepository, notificationsRepository) {
        this.ormProvider = ormProvider;
        this.notificationProvider = notificationProvider;
        this.usersRepository = usersRepository;
        this.notificationsRepository = notificationsRepository;
    }
    async execute({ body, title, groupId, machineId, operatorId, }) {
        let operator;
        const users = await this.usersRepository.find({
            filters: {
                groupIds: [groupId],
                role: role_1.default.MANAGER,
            },
        });
        if (operatorId) {
            operator = await this.usersRepository.findOne({
                by: 'id',
                value: operatorId,
            });
        }
        let tokens = users
            .filter(user => user?.deviceToken !== undefined)
            .map(user => user.deviceToken);
        if (operator?.deviceToken)
            tokens = [...tokens, operator.deviceToken];
        const firebaseMessageInfos = await this.notificationProvider.sendToDevices({
            title,
            body,
            tokens,
        });
        const receivers = operator?.id
            ? [
                ...users
                    .filter(user => user.deviceToken !== undefined)
                    .map(user => user.id),
                operator.id,
            ]
            : users.map(user => user.id);
        this.notificationsRepository.create({
            body,
            title,
            groupId,
            receivers,
            machineId,
        });
        await this.ormProvider.commit();
    }
};
CreateNotificationService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('OrmProvider')),
    __param(1, tsyringe_1.inject('NotificationProvider')),
    __param(2, tsyringe_1.inject('UsersRepository')),
    __param(3, tsyringe_1.inject('NotificationsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CreateNotificationService);
exports.default = CreateNotificationService;
