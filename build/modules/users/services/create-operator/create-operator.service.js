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
const role_1 = __importDefault(require("../../contracts/enums/role"));
const permissions_1 = __importDefault(require("../../contracts/models/permissions"));
const user_1 = __importDefault(require("../../contracts/models/user"));
const users_repository_1 = __importDefault(require("../../contracts/repositories/users.repository"));
const validate_permissions_1 = __importDefault(require("../../utils/validate-permissions"));
const hash_provider_1 = __importDefault(require("../../../../providers/hash-provider/contracts/models/hash-provider"));
const mail_provider_1 = __importDefault(require("../../../../providers/mail-provider/contracts/models/mail.provider"));
const sign_up_email_template_1 = __importDefault(require("../../../../providers/mail-provider/templates/sign-up-email-template"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const get_group_universe_1 = __importDefault(require("../../../../shared/utils/get-group-universe"));
const is_in_group_universe_1 = __importDefault(require("../../../../shared/utils/is-in-group-universe"));
const tsyringe_1 = require("tsyringe");
const log_type_enum_1 = __importDefault(require("../../../logs/contracts/enums/log-type.enum"));
const logs_repository_1 = __importDefault(require("../../../logs/contracts/repositories/logs-repository"));
let CreateOperatorService = class CreateOperatorService {
    constructor(usersRepository, hashProvider, mailProvider, logsRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
        this.mailProvider = mailProvider;
        this.logsRepository = logsRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, email, name, groupIds, permissions, phoneNumber, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        const universe = await get_group_universe_1.default(user);
        if (!is_in_group_universe_1.default({
            groups: groupIds,
            universe,
            method: 'UNION',
        }))
            throw app_error_1.default.authorizationError;
        if (user.role !== role_1.default.OWNER && !user.permissions?.createOperators)
            throw app_error_1.default.authorizationError;
        if (!validate_permissions_1.default({
            for: 'OPERATOR',
            permissions,
        }))
            throw app_error_1.default.incorrectPermissionsForOperator;
        email = email.toLowerCase();
        const emailExists = await this.usersRepository.findOne({
            by: 'email',
            value: email,
        });
        if (emailExists)
            throw app_error_1.default.emailAlreadyUsed;
        const password = crypto_1.randomBytes(3).toString('hex');
        const operator = this.usersRepository.create({
            email,
            password: this.hashProvider.hash(password),
            name,
            role: role_1.default.OPERATOR,
            groupIds,
            permissions,
            stock: {
                prizes: [],
                supplies: [],
            },
            phoneNumber,
            isActive: true,
            ownerId: user.ownerId || user.id,
        });
        const mailData = sign_up_email_template_1.default({
            receiverName: operator.name,
            receiverEmail: operator.email,
            password,
        });
        this.mailProvider.send({
            receiverName: operator.name,
            receiverEmail: operator.email,
            subject: mailData.subject,
            html: mailData.htmlBody,
            text: mailData.plainText,
        });
        this.logsRepository.create({
            createdBy: user.id,
            groupId: undefined,
            ownerId: user.ownerId || user.id,
            type: log_type_enum_1.default.CREATE_OPERATOR,
            userId: operator.id,
        });
        await this.ormProvider.commit();
        return operator;
    }
};
CreateOperatorService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('HashProvider')),
    __param(2, tsyringe_1.inject('MailProvider')),
    __param(3, tsyringe_1.inject('LogsRepository')),
    __param(4, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CreateOperatorService);
exports.default = CreateOperatorService;
