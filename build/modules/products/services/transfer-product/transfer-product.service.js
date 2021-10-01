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
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const product_logs_repository_1 = __importDefault(require("../../contracts/repositories/product-logs.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const product_1 = __importDefault(require("../../../users/contracts/models/product"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const get_group_universe_1 = __importDefault(require("../../../../shared/utils/get-group-universe"));
const is_in_group_universe_1 = __importDefault(require("../../../../shared/utils/is-in-group-universe"));
const tsyringe_1 = require("tsyringe");
let TransferProductService = class TransferProductService {
    constructor(usersRepository, groupsRepository, machinesRepository, productLogsRepository, logsRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
        this.machinesRepository = machinesRepository;
        this.productLogsRepository = productLogsRepository;
        this.logsRepository = logsRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, productType, productId, productQuantity, cost, from, to, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        let fromProduct;
        let toProduct;
        if (from.type === 'USER') {
            if (productType === 'PRIZE') {
                fromProduct = user.stock?.prizes.find(p => p.id === productId);
            }
            else {
                fromProduct = user.stock?.supplies.find(p => p.id === productId);
            }
            if (!fromProduct)
                throw app_error_1.default.productNotFound;
            if (productQuantity > fromProduct.quantity)
                throw app_error_1.default.insufficientProducts;
            fromProduct.quantity -= productQuantity;
            this.usersRepository.save(user);
        }
        if (from.type === 'GROUP') {
            const groupUniverse = await get_group_universe_1.default(user);
            if (!is_in_group_universe_1.default({
                universe: groupUniverse,
                groups: [from.id],
                method: 'INTERSECTION',
            }))
                throw app_error_1.default.authorizationError;
            const group = await this.groupsRepository.findOne({
                by: 'id',
                value: from.id,
            });
            if (!group)
                throw app_error_1.default.groupNotFound;
            if (productType === 'PRIZE') {
                fromProduct = group.stock.prizes.find(p => p.id === productId);
            }
            else {
                fromProduct = group.stock.supplies.find(p => p.id === productId);
            }
            if (!fromProduct)
                throw app_error_1.default.productNotFound;
            if (productQuantity > fromProduct.quantity)
                throw app_error_1.default.insufficientProducts;
            fromProduct.quantity -= productQuantity;
            this.groupsRepository.save(group);
        }
        if (to.type === 'USER') {
            const toUser = await this.usersRepository.findOne({
                by: 'id',
                value: to.id,
            });
            if (!toUser)
                throw app_error_1.default.userNotFound;
            if (user.role === role_1.default.OPERATOR && toUser.role === role_1.default.OPERATOR)
                throw app_error_1.default.noTransfersBetweenOperators;
            const groupUniverse = await get_group_universe_1.default(user);
            if (!is_in_group_universe_1.default({
                universe: groupUniverse,
                groups: toUser.groupIds || [],
                method: 'INTERSECTION',
            }))
                throw app_error_1.default.authorizationError;
            if (productType === 'PRIZE') {
                toProduct = toUser.stock?.prizes.find(p => p.id === productId);
                if (!toProduct) {
                    toUser.stock?.prizes.push({
                        ...fromProduct,
                        quantity: productQuantity,
                    });
                }
                else {
                    toProduct.quantity += productQuantity;
                }
            }
            else {
                toProduct = toUser.stock?.supplies.find(p => p.id === productId);
                if (!toProduct) {
                    toUser.stock?.supplies.push({
                        ...fromProduct,
                        quantity: productQuantity,
                    });
                }
                else {
                    toProduct.quantity += productQuantity;
                }
            }
            this.usersRepository.save(toUser);
        }
        if (to.type === 'GROUP') {
            const groupUniverse = await get_group_universe_1.default(user);
            if (!is_in_group_universe_1.default({
                universe: groupUniverse,
                groups: [to.id],
                method: 'INTERSECTION',
            }))
                throw app_error_1.default.authorizationError;
            const group = await this.groupsRepository.findOne({
                by: 'id',
                value: to.id,
            });
            if (!group)
                throw app_error_1.default.groupNotFound;
            if (productType === 'PRIZE') {
                toProduct = group.stock?.prizes.find(p => p.id === productId);
                if (!toProduct) {
                    group.stock?.prizes.push({
                        ...fromProduct,
                        quantity: productQuantity,
                    });
                }
                else {
                    toProduct.quantity += productQuantity;
                }
            }
            else {
                toProduct = group.stock?.supplies.find(p => p.id === productId);
                if (!toProduct) {
                    group.stock?.supplies.push({
                        ...fromProduct,
                        quantity: productQuantity,
                    });
                }
                else {
                    toProduct.quantity += productQuantity;
                }
            }
            this.groupsRepository.save(group);
        }
        if (to.type === 'MACHINE') {
            const machine = await this.machinesRepository.findOne({
                by: 'id',
                value: to.id,
            });
            if (!machine)
                throw app_error_1.default.machineNotFound;
            if (user.role === role_1.default.OPERATOR) {
                if (machine.operatorId !== user.id)
                    throw app_error_1.default.authorizationError;
            }
            else {
                const groupUniverse = await get_group_universe_1.default(user);
                if (!is_in_group_universe_1.default({
                    universe: groupUniverse,
                    groups: [machine.groupId],
                    method: 'INTERSECTION',
                }))
                    throw app_error_1.default.authorizationError;
            }
            const box = machine.boxes.find(box => box.id === to.boxId);
            if (!box)
                throw app_error_1.default.boxNotFound;
            box.numberOfPrizes += productQuantity;
            this.machinesRepository.save(machine);
        }
        if (from.type === 'GROUP' && to.type === 'GROUP') {
            this.productLogsRepository.create({
                cost: cost || 0,
                groupId: from.id,
                productName: fromProduct.label,
                productType,
                quantity: productQuantity,
                logType: 'OUT',
            });
            this.productLogsRepository.create({
                cost: cost || 0,
                groupId: to.id,
                productName: fromProduct.label,
                productType,
                quantity: productQuantity,
                logType: 'IN',
            });
        }
        if (from.type === 'USER' && to.type === 'USER') {
            this.logsRepository.create({
                createdBy: from.id,
                userId: to.id,
                ownerId: user.ownerId || user.id,
                quantity: productQuantity,
                productName: fromProduct?.label,
                type: log_type_enum_1.default.TRANSFER_STOCK_USER_TO_USER,
            });
        }
        if (from.type === 'USER' && to.type === 'GROUP') {
            const group = await this.groupsRepository.findOne({
                by: 'id',
                value: to.id,
            });
            if (!group)
                throw app_error_1.default.groupNotFound;
            this.logsRepository.create({
                createdBy: from.id,
                groupId: to.id,
                ownerId: group.ownerId,
                quantity: productQuantity,
                productName: fromProduct?.label,
                type: log_type_enum_1.default.TRANSFER_STOCK_USER_TO_GROUP,
            });
        }
        if (from.type === 'USER' && to.type === 'MACHINE') {
            const machine = await this.machinesRepository.findOne({
                by: 'id',
                value: to.id,
            });
            if (!machine)
                throw app_error_1.default.machineNotFound;
            this.logsRepository.create({
                createdBy: from.id,
                machineId: to.id,
                groupId: machine.groupId,
                ownerId: user.ownerId || user.id,
                quantity: productQuantity,
                productName: fromProduct?.label,
                type: log_type_enum_1.default.TRANSFER_STOCK_USER_TO_MACHINE,
            });
        }
        if (from.type === 'GROUP' && to.type === 'GROUP') {
            const group = await this.groupsRepository.findOne({
                by: 'id',
                value: from.id,
            });
            if (!group)
                throw app_error_1.default.groupNotFound;
            this.logsRepository.create({
                createdBy: user.id,
                groupId: from.id,
                ownerId: group.ownerId,
                affectedGroupId: to.id,
                quantity: productQuantity,
                productName: fromProduct?.label,
                type: log_type_enum_1.default.TRANSFER_STOCK_GROUP_TO_GROUP,
            });
        }
        if (from.type === 'GROUP' && to.type === 'USER') {
            const group = await this.groupsRepository.findOne({
                by: 'id',
                value: from.id,
            });
            if (!group)
                throw app_error_1.default.groupNotFound;
            this.logsRepository.create({
                createdBy: user.id,
                groupId: from.id,
                ownerId: group.ownerId,
                userId: to.id,
                quantity: productQuantity,
                productName: fromProduct?.label,
                type: log_type_enum_1.default.TRANSFER_STOCK_GROUP_TO_USER,
            });
        }
        await this.ormProvider.commit();
    }
};
TransferProductService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('GroupsRepository')),
    __param(2, tsyringe_1.inject('MachinesRepository')),
    __param(3, tsyringe_1.inject('ProductLogsRepository')),
    __param(4, tsyringe_1.inject('LogsRepository')),
    __param(5, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], TransferProductService);
exports.default = TransferProductService;
