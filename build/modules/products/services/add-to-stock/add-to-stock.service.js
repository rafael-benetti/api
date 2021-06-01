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
const product_logs_repository_1 = __importDefault(require("../../contracts/repositories/product-logs.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const get_group_universe_1 = __importDefault(require("../../../../shared/utils/get-group-universe"));
const is_in_group_universe_1 = __importDefault(require("../../../../shared/utils/is-in-group-universe"));
const tsyringe_1 = require("tsyringe");
let AddToStockService = class AddToStockService {
    constructor(usersRepository, groupsRepository, productLogsRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
        this.productLogsRepository = productLogsRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, groupId, productId, type, quantity, cost, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.OWNER && !user.permissions?.editProducts)
            throw app_error_1.default.authorizationError;
        const universe = await get_group_universe_1.default(user);
        if (!is_in_group_universe_1.default({
            groups: [groupId],
            universe,
            method: 'INTERSECTION',
        }))
            throw app_error_1.default.authorizationError;
        const group = await this.groupsRepository.findOne({
            by: 'id',
            value: groupId,
        });
        if (!group)
            throw app_error_1.default.groupNotFound;
        const product = type === 'PRIZE'
            ? group.stock.prizes.find(p => p.id === productId)
            : group.stock.supplies.find(p => p.id === productId);
        if (!product)
            throw app_error_1.default.productNotFound;
        product.quantity += quantity;
        this.productLogsRepository.create({
            cost,
            groupId,
            productName: product.label,
            productType: type,
            quantity,
            logType: 'IN',
        });
        this.groupsRepository.save(group);
        await this.ormProvider.commit();
    }
};
AddToStockService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('GroupsRepository')),
    __param(2, tsyringe_1.inject('ProductLogsRepository')),
    __param(3, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AddToStockService);
exports.default = AddToStockService;
