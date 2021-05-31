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
const logger_1 = __importDefault(require("../../../../config/logger"));
const user_1 = __importDefault(require("../../contracts/models/user"));
const users_repository_1 = __importDefault(require("../../contracts/repositories/users.repository"));
const hash_provider_1 = __importDefault(require("../../../../providers/hash-provider/contracts/models/hash-provider"));
const session_provider_1 = __importDefault(require("../../../../providers/session-provider/contracts/models/session.provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let AuthenticateUserService = class AuthenticateUserService {
    constructor(usersRepository, hashProvider, sessionProvider) {
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
        this.sessionProvider = sessionProvider;
    }
    async execute({ email, password }) {
        const user = await this.usersRepository.findOne({
            by: 'email',
            value: email,
        });
        if (!user)
            throw app_error_1.default.incorrectEmailOrPassword;
        if (user.isActive === false)
            throw app_error_1.default.incorrectEmailOrPassword;
        if (!this.hashProvider.compare(password, user.password))
            throw app_error_1.default.incorrectEmailOrPassword;
        const token = await this.sessionProvider.createToken(user.id);
        return {
            token,
            user,
        };
    }
};
AuthenticateUserService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('HashProvider')),
    __param(2, tsyringe_1.inject('SessionProvider')),
    __metadata("design:paramtypes", [Object, Object, Object])
], AuthenticateUserService);
exports.default = AuthenticateUserService;
