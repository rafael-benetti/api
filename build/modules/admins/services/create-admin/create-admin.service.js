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
const admin_1 = __importDefault(require("../../contracts/models/admin"));
const admins_repository_1 = __importDefault(require("../../contracts/repositories/admins.repository"));
const hash_provider_1 = __importDefault(require("../../../../providers/hash-provider/contracts/models/hash-provider"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let CreateAdminService = class CreateAdminService {
    constructor(adminsRepository, hashProvider, ormProvider) {
        this.adminsRepository = adminsRepository;
        this.hashProvider = hashProvider;
        this.ormProvider = ormProvider;
    }
    async execute({ email, name }) {
        email = email.toLowerCase();
        const emailExists = await this.adminsRepository.findOne({
            by: 'email',
            value: email,
        });
        if (emailExists)
            throw app_error_1.default.emailAlreadyUsed;
        const admin = this.adminsRepository.create({
            email,
            password: this.hashProvider.hash('q1'),
            name,
        });
        await this.ormProvider.commit();
        return admin;
    }
};
CreateAdminService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('AdminsRepository')),
    __param(1, tsyringe_1.inject('HashProvider')),
    __param(2, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateAdminService);
exports.default = CreateAdminService;