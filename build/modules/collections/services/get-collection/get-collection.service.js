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
const collection_1 = __importDefault(require("../../contracts/entities/collection"));
const collections_repository_1 = __importDefault(require("../../contracts/repositories/collections.repository"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const get_group_universe_1 = __importDefault(require("../../../../shared/utils/get-group-universe"));
const tsyringe_1 = require("tsyringe");
let GetCollectionService = class GetCollectionService {
    constructor(usersRepository, collectionsRepository) {
        this.usersRepository = usersRepository;
        this.collectionsRepository = collectionsRepository;
    }
    async execute({ userId, collectionId, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        const groupIds = await get_group_universe_1.default(user);
        const collection = await this.collectionsRepository.findOne(collectionId);
        if (!collection)
            throw app_error_1.default.collectionNotFound;
        if (!groupIds.includes(collection.groupId))
            throw app_error_1.default.authorizationError;
        return collection;
    }
};
GetCollectionService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('CollectionsRepository')),
    __metadata("design:paramtypes", [Object, Object])
], GetCollectionService);
exports.default = GetCollectionService;
