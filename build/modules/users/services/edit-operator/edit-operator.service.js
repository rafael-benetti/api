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
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const routes_repository_1 = __importDefault(require("../../../routes/contracts/repositories/routes.repository"));
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
let EditOperatorService = class EditOperatorService {
    constructor(usersRepository, routesRepository, machinesRepository, ormProvider) {
        this.usersRepository = usersRepository;
        this.routesRepository = routesRepository;
        this.machinesRepository = machinesRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, operatorId, groupIds, permissions, phoneNumber, isActive, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role !== role_1.default.OWNER && !user.permissions?.createOperators)
            throw app_error_1.default.authorizationError;
        const operator = await this.usersRepository.findOne({
            by: 'id',
            value: operatorId,
        });
        if (!operator)
            throw app_error_1.default.userNotFound;
        if (operator.role !== role_1.default.OPERATOR)
            throw app_error_1.default.userNotFound;
        if (user.role === role_1.default.OWNER && operator.ownerId !== user.id)
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
                if (operator.groupIds?.every(groupId => !universe.includes(groupId)))
                    throw app_error_1.default.authorizationError;
            }
            const commonGroups = operator.groupIds?.filter(group => universe.includes(group));
            const deletedGroups = commonGroups?.filter(group => !groupIds.includes(group));
            const routesToDelete = await this.routesRepository.find({
                operatorId: operator.id,
                groupIds: deletedGroups,
            });
            routesToDelete.forEach(route => {
                delete route.operatorId;
                this.routesRepository.save(route);
            });
            const { machines: machinesToDelete } = await this.machinesRepository.find({
                operatorId: operator.id,
                groupIds: deletedGroups,
            });
            machinesToDelete.forEach(machine => {
                delete machine.operatorId;
                this.machinesRepository.save(machine);
            });
            let uncommonGroups;
            if (user.role === role_1.default.OWNER) {
                uncommonGroups = operator.groupIds?.filter(group => !operator.groupIds
                    ?.filter(group => user.groupIds?.includes(group))
                    ?.includes(group));
            }
            operator.groupIds = [...groupIds, ...(uncommonGroups || [])];
        }
        if (permissions) {
            if (!validate_permissions_1.default({
                for: 'OPERATOR',
                permissions,
            }))
                throw app_error_1.default.incorrectPermissionsForOperator;
            operator.permissions = permissions;
        }
        if (phoneNumber)
            operator.phoneNumber = phoneNumber;
        if (isActive !== undefined)
            operator.isActive = isActive;
        this.usersRepository.save(operator);
        await this.ormProvider.commit();
        return operator;
    }
};
EditOperatorService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('RoutesRepository')),
    __param(2, tsyringe_1.inject('MachinesRepository')),
    __param(3, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], EditOperatorService);
exports.default = EditOperatorService;
