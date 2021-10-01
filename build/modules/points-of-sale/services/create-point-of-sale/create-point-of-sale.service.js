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
const groups_repository_1 = __importDefault(require("../../../groups/contracts/repositories/groups.repository"));
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
let CreatePointOfSaleService = class CreatePointOfSaleService {
    constructor(usersRepository, groupsRepository, pointsOfSaleRepository, logsRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.logsRepository = logsRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, groupId, label, contactName, primaryPhoneNumber, secondaryPhoneNumber, rent, isPercentage, address, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        // TODO: VERIFICAR ISSO AQUI EIN
        if (user.role !== role_1.default.OWNER &&
            (!user.permissions?.createPointsOfSale ||
                !user.groupIds?.includes(groupId)))
            throw app_error_1.default.authorizationError;
        const group = await this.groupsRepository.findOne({
            by: 'id',
            value: groupId,
        });
        if (!group)
            throw app_error_1.default.groupNotFound;
        const pointOfSale = this.pointsOfSaleRepository.create({
            ownerId: user.ownerId || user.id,
            groupId,
            label,
            contactName,
            primaryPhoneNumber,
            secondaryPhoneNumber,
            rent,
            isPercentage,
            address,
        });
        this.logsRepository.create({
            createdBy: user.id,
            groupId,
            ownerId: user.ownerId || user.id,
            type: log_type_enum_1.default.CREATE_POS,
            posId: pointOfSale.id,
        });
        await this.ormProvider.commit();
        return pointOfSale;
    }
};
CreatePointOfSaleService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('GroupsRepository')),
    __param(2, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(3, tsyringe_1.inject('LogsRepository')),
    __param(4, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CreatePointOfSaleService);
exports.default = CreatePointOfSaleService;
