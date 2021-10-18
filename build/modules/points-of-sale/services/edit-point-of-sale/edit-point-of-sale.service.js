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
const log_type_enum_1 = __importDefault(require("../../../logs/contracts/enums/log-type.enum"));
const logs_repository_1 = __importDefault(require("../../../logs/contracts/repositories/logs-repository"));
const address_1 = __importDefault(require("../../contracts/models/address"));
const point_of_sale_1 = __importDefault(require("../../contracts/models/point-of-sale"));
const points_of_sale_repository_1 = __importDefault(require("../../contracts/repositories/points-of-sale.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let EditPointOfSaleService = class EditPointOfSaleService {
    constructor(usersRepository, pointsOfSaleRepository, logsRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.logsRepository = logsRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, pointOfSaleId, label, contactName, primaryPhoneNumber, secondaryPhoneNumber, rent, isPercentage, address, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.OWNER && !user.permissions?.editPointsOfSale)
            throw app_error_1.default.authorizationError;
        const pointOfSale = await this.pointsOfSaleRepository.findOne({
            by: 'id',
            value: pointOfSaleId,
        });
        if (!pointOfSale)
            throw app_error_1.default.pointOfSaleNotFound;
        if (user.role === role_1.default.OWNER) {
            if (user.id !== pointOfSale.ownerId)
                throw app_error_1.default.authorizationError;
        }
        else if (!user.groupIds?.includes(pointOfSale.groupId))
            throw app_error_1.default.authorizationError;
        if (label)
            pointOfSale.label = label;
        if (contactName)
            pointOfSale.contactName = contactName;
        if (primaryPhoneNumber)
            pointOfSale.primaryPhoneNumber = primaryPhoneNumber;
        if (secondaryPhoneNumber)
            pointOfSale.secondaryPhoneNumber = secondaryPhoneNumber;
        if (rent !== undefined)
            pointOfSale.rent = rent;
        if (isPercentage !== undefined)
            pointOfSale.isPercentage = isPercentage;
        if (address)
            pointOfSale.address.extraInfo = address.extraInfo;
        this.pointsOfSaleRepository.save(pointOfSale);
        this.logsRepository.create({
            createdBy: user.id,
            groupId: pointOfSale.groupId,
            ownerId: user.ownerId || user.id,
            type: log_type_enum_1.default.EDIT_POS,
            posId: pointOfSale.id,
        });
        await this.ormProvider.commit();
        return pointOfSale;
    }
};
EditPointOfSaleService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(2, tsyringe_1.inject('LogsRepository')),
    __param(3, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], EditPointOfSaleService);
exports.default = EditPointOfSaleService;
