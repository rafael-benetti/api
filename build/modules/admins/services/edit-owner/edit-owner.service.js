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
const admins_repository_1 = __importDefault(require("../../contracts/repositories/admins.repository"));
const user_1 = __importDefault(require("../../../users/contracts/models/user"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const hash_provider_1 = __importDefault(require("../../../../providers/hash-provider/contracts/models/hash-provider"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let EditOwnerService = class EditOwnerService {
    constructor(adminsRepository, usersRepository, hashProvider, ormProvider) {
        this.adminsRepository = adminsRepository;
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
        this.ormProvider = ormProvider;
    }
    async execute({ ownerId, name, password, adminId, document, phoneNumber, stateRegistration, subscriptionExpirationDate, subscriptionPrice, }) {
        const admin = await this.adminsRepository.findOne({
            by: 'id',
            value: adminId,
        });
        if (!admin)
            throw app_error_1.default.authorizationError;
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: ownerId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (password)
            user.password = this.hashProvider.hash(password);
        if (name)
            user.name = name;
        if (document)
            user.document = document;
        if (phoneNumber)
            user.phoneNumber = phoneNumber;
        if (stateRegistration)
            user.stateRegistration = stateRegistration;
        if (subscriptionExpirationDate)
            user.subscriptionExpirationDate = subscriptionExpirationDate;
        if (subscriptionPrice)
            user.subscriptionPrice = subscriptionPrice;
        this.usersRepository.save(user);
        await this.ormProvider.commit();
        return user;
    }
};
EditOwnerService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('AdminsRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __param(2, tsyringe_1.inject('HashProvider')),
    __param(3, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], EditOwnerService);
exports.default = EditOwnerService;
