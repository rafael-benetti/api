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
const collections_repository_1 = __importDefault(require("../../contracts/repositories/collections.repository"));
const groups_repository_1 = __importDefault(require("../../../groups/contracts/repositories/groups.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let ReviewCollectionService = class ReviewCollectionService {
    constructor(usersRepository, collectionsRepository, groupsRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.collectionsRepository = collectionsRepository;
        this.groupsRepository = groupsRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, collectionId }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        const collection = await this.collectionsRepository.findOne(collectionId);
        if (!collection)
            throw app_error_1.default.collectionNotFound;
        if (collection.reviewedData?.date)
            throw app_error_1.default.collectionAlreadyReviewed;
        if (user.role !== role_1.default.MANAGER && user.role !== role_1.default.OWNER)
            throw app_error_1.default.authorizationError;
        if (user.role === role_1.default.OWNER) {
            const groupIds = (await this.groupsRepository.find({
                filters: {
                    ownerId: user.id,
                },
            })).map(group => group.id);
            if (!groupIds.includes(collection.groupId))
                throw app_error_1.default.authorizationError;
        }
        if (user.role === role_1.default.MANAGER)
            if (!user.groupIds?.includes(collection.groupId))
                throw app_error_1.default.authorizationError;
        collection.reviewedData = {
            date: new Date(),
            reviewedBy: user.id,
            reviewerName: user.name,
        };
        this.collectionsRepository.save(collection);
        await this.ormProvider.commit();
    }
};
ReviewCollectionService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('CollectionsRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ReviewCollectionService);
exports.default = ReviewCollectionService;
