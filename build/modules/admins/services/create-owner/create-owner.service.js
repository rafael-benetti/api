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
const admins_repository_1 = __importDefault(require("../../contracts/repositories/admins.repository"));
const couter_types_repository_1 = __importDefault(require("../../../counter-types/contracts/repositories/couter-types.repository"));
const groups_repository_1 = __importDefault(require("../../../groups/contracts/repositories/groups.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const hash_provider_1 = __importDefault(require("../../../../providers/hash-provider/contracts/models/hash-provider"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
const mail_provider_1 = __importDefault(require("../../../../providers/mail-provider/contracts/models/mail.provider"));
const sign_up_email_template_1 = __importDefault(require("../../../../providers/mail-provider/templates/sign-up-email-template"));
const type_1 = __importDefault(require("../../../counter-types/contracts/enums/type"));
let CreateOwnerService = class CreateOwnerService {
    constructor(adminsRepository, usersRepository, groupsRepository, counterTypesRepository, mailProvider, hashProvider, ormProvider) {
        this.adminsRepository = adminsRepository;
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
        this.counterTypesRepository = counterTypesRepository;
        this.mailProvider = mailProvider;
        this.hashProvider = hashProvider;
        this.ormProvider = ormProvider;
    }
    async execute({ adminId, email, name }) {
        const admin = await this.adminsRepository.findOne({
            by: 'id',
            value: adminId,
        });
        if (!admin)
            throw app_error_1.default.authorizationError;
        const emailExists = await this.usersRepository.findOne({
            by: 'email',
            value: email,
        });
        if (emailExists)
            throw app_error_1.default.emailAlreadyUsed;
        const password = crypto_1.randomBytes(3).toString('hex');
        const user = this.usersRepository.create({
            email,
            password: this.hashProvider.hash(password),
            name,
            role: role_1.default.OWNER,
        });
        const mailData = sign_up_email_template_1.default({
            receiverName: user.name,
            receiverEmail: user.email,
            password,
        });
        this.mailProvider.send({
            receiverName: user.name,
            receiverEmail: user.email,
            subject: mailData.subject,
            html: mailData.htmlBody,
            text: mailData.plainText,
        });
        this.groupsRepository.create({
            isPersonal: true,
            ownerId: user.id,
        });
        this.counterTypesRepository.create({
            label: 'Moedeiro',
            type: type_1.default.IN,
            ownerId: user.id,
        });
        this.counterTypesRepository.create({
            label: 'Noteiro',
            type: type_1.default.IN,
            ownerId: user.id,
        });
        this.counterTypesRepository.create({
            label: 'Cartão',
            type: type_1.default.IN,
            ownerId: user.id,
        });
        this.counterTypesRepository.create({
            label: 'Crédito Remoto',
            type: type_1.default.IN,
            ownerId: user.id,
        });
        this.counterTypesRepository.create({
            label: 'Prêmio',
            type: type_1.default.OUT,
            ownerId: user.id,
        });
        await this.ormProvider.commit();
    }
};
CreateOwnerService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('AdminsRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('CounterTypesRepository')),
    __param(4, tsyringe_1.inject('MailProvider')),
    __param(5, tsyringe_1.inject('HashProvider')),
    __param(6, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], CreateOwnerService);
exports.default = CreateOwnerService;
