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
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const product_1 = __importDefault(require("../../../users/contracts/models/product"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const get_group_universe_1 = __importDefault(require("../../../../shared/utils/get-group-universe"));
const is_in_group_universe_1 = __importDefault(require("../../../../shared/utils/is-in-group-universe"));
const tsyringe_1 = require("tsyringe");
let DeleteProductService = class DeleteProductService {
    constructor(usersRepository, groupsRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, productType, productId, from, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.OWNER && !user.permissions?.deleteProducts)
            throw app_error_1.default.authorizationError;
        let product;
        if (from.type === 'USER') {
            if (productType === 'PRIZE') {
                product = user.stock?.prizes.find(p => p.id === productId);
                if (!product)
                    throw app_error_1.default.productNotFound;
                if (product.quantity !== 0)
                    throw app_error_1.default.productInStock;
                const index = user.stock?.prizes.indexOf(product);
                user.stock?.prizes.splice(index, 1);
            }
            else {
                product = user.stock?.supplies.find(p => p.id === productId);
                if (!product)
                    throw app_error_1.default.productNotFound;
                if (product.quantity !== 0)
                    throw app_error_1.default.productInStock;
                const index = user.stock?.supplies.indexOf(product);
                user.stock?.supplies.splice(index, 1);
            }
            this.usersRepository.save(user);
        }
        if (from.type === 'GROUP') {
            const universe = await get_group_universe_1.default(user);
            if (!is_in_group_universe_1.default({
                groups: [from.id],
                universe,
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
                product = group.stock?.prizes.find(p => p.id === productId);
                if (!product)
                    throw app_error_1.default.productNotFound;
                if (product.quantity !== 0)
                    throw app_error_1.default.productInStock;
                const index = group.stock?.prizes.indexOf(product);
                group.stock?.prizes.splice(index, 1);
            }
            else {
                product = group.stock?.supplies.find(p => p.id === productId);
                if (!product)
                    throw app_error_1.default.productNotFound;
                if (product.quantity !== 0)
                    throw app_error_1.default.productInStock;
                const index = group.stock?.supplies.indexOf(product);
                group.stock?.supplies.splice(index, 1);
            }
            this.groupsRepository.save(group);
        }
        await this.ormProvider.commit();
    }
};
DeleteProductService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('GroupsRepository')),
    __param(2, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object])
], DeleteProductService);
exports.default = DeleteProductService;
