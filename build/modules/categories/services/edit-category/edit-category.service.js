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
const category_1 = __importDefault(require("../../contracts/models/category"));
const categories_repository_1 = __importDefault(require("../../contracts/repositories/categories.repository"));
const couter_types_repository_1 = __importDefault(require("../../../counter-types/contracts/repositories/couter-types.repository"));
const box_1 = __importDefault(require("../../../machines/contracts/models/box"));
const counter_1 = __importDefault(require("../../../machines/contracts/models/counter"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let EditCategoryService = class EditCategoryService {
    constructor(categoriesRepository, usersRepository, counterTypesRepository, ormProvider) {
        this.categoriesRepository = categoriesRepository;
        this.usersRepository = usersRepository;
        this.counterTypesRepository = counterTypesRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, categoryId, label, boxes, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.OWNER && user.role !== role_1.default.MANAGER)
            throw app_error_1.default.authorizationError;
        const category = await this.categoriesRepository.findOne({
            by: 'id',
            value: categoryId,
        });
        if (!category)
            throw app_error_1.default.machineCategoryNotFound;
        if (user.role === role_1.default.MANAGER)
            if (!user.permissions?.editCategories)
                throw app_error_1.default.authorizationError;
        if (label && category.label !== label) {
            const checkCategoryExists = await this.categoriesRepository.findOne({
                by: 'label',
                value: label,
            });
            if (checkCategoryExists)
                throw app_error_1.default.labelAlreadyInUsed;
            category.label = label;
        }
        if (boxes) {
            const boxesEntities = boxes.map(box => {
                const counters = box.counters.map(counter => new counter_1.default(counter));
                return new box_1.default({ id: box.id, counters });
            });
            const counterTypeIds = [
                ...new Set(boxesEntities.flatMap(boxe => boxe.counters.map(counter => counter.counterTypeId))),
            ];
            const counterTypes = await this.counterTypesRepository.find({
                id: counterTypeIds,
            });
            if (counterTypeIds.length !== counterTypes.length)
                throw app_error_1.default.authorizationError;
            category.boxes = boxesEntities;
        }
        this.categoriesRepository.save(category);
        await this.ormProvider.commit();
        return category;
    }
};
EditCategoryService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('CategoriesRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __param(2, tsyringe_1.inject('CounterTypesRepository')),
    __param(3, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], EditCategoryService);
exports.default = EditCategoryService;
