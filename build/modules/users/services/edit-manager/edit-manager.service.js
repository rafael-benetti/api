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
const log_type_enum_1 = __importDefault(require("../../../logs/contracts/enums/log-type.enum"));
const logs_repository_1 = __importDefault(require("../../../logs/contracts/repositories/logs-repository"));
const role_1 = __importDefault(require("../../contracts/enums/role"));
const permissions_1 = __importDefault(require("../../contracts/models/permissions"));
const user_1 = __importDefault(require("../../contracts/models/user"));
const users_repository_1 = __importDefault(require("../../contracts/repositories/users.repository"));
const validate_permissions_1 = __importDefault(require("../../utils/validate-permissions"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const get_group_universe_1 = __importDefault(require("../../../../shared/utils/get-group-universe"));
const is_in_group_universe_1 = __importDefault(require("../../../../shared/utils/is-in-group-universe"));
const tsyringe_1 = require("tsyringe");
let EditManagerService = class EditManagerService {
    constructor(usersRepository, logsRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.logsRepository = logsRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, managerId, groupIds, permissions, phoneNumber, isActive, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.OWNER && !user.permissions?.createManagers)
            throw app_error_1.default.authorizationError;
        const manager = await this.usersRepository.findOne({
            by: 'id',
            value: managerId,
        });
        if (!manager)
            throw app_error_1.default.userNotFound;
        if (manager.role !== role_1.default.MANAGER)
            throw app_error_1.default.userNotFound;
        if (user.role === role_1.default.OWNER && manager.ownerId !== user.id)
            throw app_error_1.default.authorizationError;
        if (groupIds) {
            const universe = await get_group_universe_1.default(user);
            if (!is_in_group_universe_1.default({
                groups: groupIds,
                universe,
                method: 'INTERSECTION',
            }))
                throw app_error_1.default.authorizationError;
            if (user.role !== role_1.default.OWNER) {
                if (manager.groupIds?.every(groupId => !universe.includes(groupId)))
                    throw app_error_1.default.authorizationError;
            }
            const uncommonGroups = manager.groupIds?.filter(group => !manager.groupIds
                ?.filter(group => universe.includes(group))
                ?.includes(group));
            manager.groupIds = [...groupIds, ...(uncommonGroups || [])];
        }
        if (permissions) {
            if (!validate_permissions_1.default({
                for: 'MANAGER',
                permissions,
            }))
                throw app_error_1.default.incorrectPermissionsForManager;
            manager.permissions = permissions;
        }
        if (phoneNumber)
            manager.phoneNumber = phoneNumber;
        if (isActive !== undefined)
            manager.isActive = isActive;
        this.usersRepository.save(manager);
        this.logsRepository.create({
            createdBy: user.id,
            groupId: undefined,
            ownerId: user.ownerId || user.id,
            type: log_type_enum_1.default.EDIT_MANAGER,
            userId: manager.id,
        });
        await this.ormProvider.commit();
        return manager;
    }
};
EditManagerService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('LogsRepository')),
    __param(2, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object])
], EditManagerService);
exports.default = EditManagerService;
