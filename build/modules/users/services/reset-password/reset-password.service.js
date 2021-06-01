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
const crypto_1 = require("crypto");
const users_repository_1 = __importDefault(require("../../contracts/repositories/users.repository"));
const mail_provider_1 = __importDefault(require("../../../../providers/mail-provider/contracts/models/mail.provider"));
const session_provider_1 = __importDefault(require("../../../../providers/session-provider/contracts/models/session.provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
const hash_provider_1 = __importDefault(require("../../../../providers/hash-provider/contracts/models/hash-provider"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
let ResertPasswordService = class ResertPasswordService {
    constructor(sessionProvider, usersRepository, hashProvider, mailProvider, ormProvider) {
        this.sessionProvider = sessionProvider;
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
        this.mailProvider = mailProvider;
        this.ormProvider = ormProvider;
    }
    async execute({ resetPasswordToken }) {
        const userId = await this.sessionProvider.getPasswordResetTokenOwner(resetPasswordToken);
        if (!userId)
            throw app_error_1.default.invalidToken;
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        const password = crypto_1.randomBytes(3).toString('hex');
        user.password = this.hashProvider.hash(password);
        this.usersRepository.save(user);
        this.mailProvider.send({
            receiverName: user.name,
            receiverEmail: user.email,
            subject: 'Senha baga',
            html: password,
            text: password,
        });
        await this.ormProvider.commit();
    }
};
ResertPasswordService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('SessionProvider')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __param(2, tsyringe_1.inject('HashProvider')),
    __param(3, tsyringe_1.inject('MailProvider')),
    __param(4, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], ResertPasswordService);
exports.default = ResertPasswordService;
