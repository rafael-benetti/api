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
const session_provider_1 = __importDefault(require("../../../../providers/session-provider/contracts/models/session.provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let GetUserTokenService = class GetUserTokenService {
    constructor(usersRepository, adminsRepository, sessionProvider) {
        this.usersRepository = usersRepository;
        this.adminsRepository = adminsRepository;
        this.sessionProvider = sessionProvider;
    }
    async execute({ adminId, userId, }) {
        const admin = await this.adminsRepository.findOne({
            by: 'id',
            value: adminId,
        });
        if (!admin)
            throw app_error_1.default.authorizationError;
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.authorizationError;
        const token = await this.sessionProvider.createToken(user.id);
        return {
            user,
            token,
        };
    }
};
GetUserTokenService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('AdminsRepository')),
    __param(2, tsyringe_1.inject('SessionProvider')),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetUserTokenService);
exports.default = GetUserTokenService;
