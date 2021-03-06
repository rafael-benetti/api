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
const log_type_enum_1 = __importDefault(require("../../../logs/contracts/enums/log-type.enum"));
const logs_repository_1 = __importDefault(require("../../../logs/contracts/repositories/logs-repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let DeleteLogsService = class DeleteLogsService {
    constructor(adminsRepository, logsRepository) {
        this.adminsRepository = adminsRepository;
        this.logsRepository = logsRepository;
    }
    async execute({ adminId, startDate, type, ownerId, }) {
        const admin = await this.adminsRepository.findOne({
            by: 'id',
            value: adminId,
        });
        if (!admin)
            throw app_error_1.default.authorizationError;
        const count = await this.logsRepository.delete({
            ownerId,
            type,
            startDate,
        });
        return count;
    }
};
DeleteLogsService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('AdminsRepository')),
    __param(1, tsyringe_1.inject('LogsRepository')),
    __metadata("design:paramtypes", [Object, Object])
], DeleteLogsService);
exports.default = DeleteLogsService;
