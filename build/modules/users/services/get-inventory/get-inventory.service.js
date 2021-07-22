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
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const telemetry_logs_repository_1 = __importDefault(require("../../../telemetry-logs/contracts/repositories/telemetry-logs.repository"));
const users_repository_1 = __importDefault(require("../../contracts/repositories/users.repository"));
const bluebird_1 = require("bluebird");
const tsyringe_1 = require("tsyringe");
const universal_financial_repository_1 = __importDefault(require("../../../universal-financial/contracts/repositories/universal-financial.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const role_1 = __importDefault(require("../../contracts/enums/role"));
const get_group_universe_1 = __importDefault(require("../../../../shared/utils/get-group-universe"));
let GetInvetoryService = class GetInvetoryService {
    constructor(usersRepository, machinesRepository, groupsRepository, telemetryLogsRepository, universalFinancialRepository) {
        this.usersRepository = usersRepository;
        this.machinesRepository = machinesRepository;
        this.groupsRepository = groupsRepository;
        this.telemetryLogsRepository = telemetryLogsRepository;
        this.universalFinancialRepository = universalFinancialRepository;
    }
    async execute({ groupId, userId }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        let groupIds;
        if (user.role === role_1.default.OPERATOR)
            throw app_error_1.default.authorizationError;
        if (user.role === role_1.default.MANAGER)
            groupIds = groupId ? [groupId] : user.groupIds;
        if (user.role === role_1.default.OWNER)
            groupIds = groupId ? [groupId] : await get_group_universe_1.default(user);
        const machinesPerCategoryPromise = this.machinesRepository.machinePerCategory({
            groupIds,
        });
        const machinesInventoryByProductPromise = this.machinesRepository.machinesInventoryByProduct({
            groupIds,
        });
        const usersInventoryByProductPromise = this.usersRepository.usersInventoryByProduct({
            filters: {
                groupIds,
            },
        });
        const groupsInventoryByProductPromise = this.groupsRepository.groupsInvertoryByProduct({
            filters: {
                ids: groupIds,
            },
        });
        const usersInventoryBySuppliePromise = this.usersRepository.usersInventoryBySupplies({
            filters: {
                groupIds,
            },
        });
        const groupsInventoryBySupplie = await this.groupsRepository.groupsInvertoryBySupplies({
            filters: {
                ids: groupIds,
            },
        });
        const [machinesPerCategory, machinesInventoryByProduct, usersInventoryByProduct, groupsInventoryByProduct, usersInventoryBySupplie,] = await bluebird_1.Promise.all([
            machinesPerCategoryPromise,
            machinesInventoryByProductPromise,
            usersInventoryByProductPromise,
            groupsInventoryByProductPromise,
            usersInventoryBySuppliePromise,
        ]);
        const allProducts = [
            ...groupsInventoryByProduct,
            ...machinesInventoryByProduct,
            ...usersInventoryByProduct,
        ];
        const allSuplies = [
            ...usersInventoryBySupplie,
            ...groupsInventoryBySupplie,
        ];
        const supliesIds = [
            ...new Set(allSuplies.map(supplie => supplie.supplieId)),
        ].filter(supplieId => supplieId);
        const productsIds = [
            ...new Set(allProducts.map(product => product.prizeId)),
        ].filter(productId => productId);
        const suppliesResponse = supliesIds.map(supplieId => {
            const groupsSupplies = groupsInventoryBySupplie.find(groupSupplie => groupSupplie.supplieId === supplieId);
            const usersSupplies = usersInventoryBySupplie.find(userSupplie => userSupplie.supplieId === supplieId);
            return {
                supplieLabel: groupsSupplies?.supplieLabel || usersSupplies?.supplieLabel,
                supplieId,
                groupsTotalSupplies: groupsSupplies?.totalSupplies || 0,
                usersTotalSupplies: usersSupplies?.totalSupplies || 0,
            };
        });
        const productsResponse = productsIds.map(productId => {
            const machinesProducts = machinesInventoryByProduct.find(machineProduct => machineProduct.prizeId === productId);
            const groupsProducts = groupsInventoryByProduct.find(groupProduct => groupProduct.prizeId === productId);
            const usersProducts = usersInventoryByProduct.find(userProduct => userProduct.prizeId === productId);
            return {
                prizeLabel: machinesProducts?.prizeLabel ||
                    groupsProducts?.prizeLabel ||
                    usersProducts?.prizeLabel,
                prizeId: productId,
                machinesTotalPrizes: machinesProducts?.totalPrizes || 0,
                groupsTotalPrizes: groupsProducts?.totalPrizes || 0,
                usersTotalPrizes: usersProducts?.totalPrizes || 0,
            };
        });
        return {
            machinesPerCategory,
            prizes: productsResponse,
            supplies: suppliesResponse,
        };
    }
};
GetInvetoryService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('MachinesRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('TelemetryLogsRepository')),
    __param(4, tsyringe_1.inject('UniversalFinancialRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], GetInvetoryService);
exports.default = GetInvetoryService;
