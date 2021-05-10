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
const user_1 = __importDefault(require("../../contracts/models/user"));
const users_repository_1 = __importDefault(require("../../contracts/repositories/users.repository"));
const hash_provider_1 = __importDefault(require("../../../../providers/hash-provider/contracts/models/hash-provider"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const storage_provider_1 = __importDefault(require("../../../../providers/storage-provider/contracts/models/storage.provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let UpdateUserProfileService = class UpdateUserProfileService {
    constructor(usersRepository, hashProvider, ormProvider, storageProvider) {
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
        this.ormProvider = ormProvider;
        this.storageProvider = storageProvider;
    }
    async execute({ userId, name, password, file, phoneNumber, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (name)
            user.name = name;
        if (password) {
            if (!this.hashProvider.compare(password.old, user.password))
                throw app_error_1.default.incorrectEmailOrPassword;
            user.password = this.hashProvider.hash(password.new);
        }
        if (file) {
            if (user.photo)
                this.storageProvider.deleteFile(user.photo.key);
            user.photo = await this.storageProvider.uploadFile(file);
        }
        if (phoneNumber)
            user.phoneNumber = phoneNumber;
        this.usersRepository.save(user);
        await this.ormProvider.commit();
        return user;
    }
};
UpdateUserProfileService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('HashProvider')),
    __param(2, tsyringe_1.inject('OrmProvider')),
    __param(3, tsyringe_1.inject('StorageProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UpdateUserProfileService);
exports.default = UpdateUserProfileService;
