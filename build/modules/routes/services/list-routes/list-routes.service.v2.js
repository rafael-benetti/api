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
/* eslint-disable no-restricted-globals */
const groups_repository_1 = __importDefault(require("../../../groups/contracts/repositories/groups.repository"));
const route_1 = __importDefault(require("../../contracts/models/route"));
const routes_repository_1 = __importDefault(require("../../contracts/repositories/routes.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let ListRoutesServiceV2 = class ListRoutesServiceV2 {
    constructor(routesRepository, usersRepository, groupsRepository) {
        this.routesRepository = routesRepository;
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
    }
    async execute({ userId, groupId, operatorId, pointOfSaleId, label, limit, offset, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        if (user.role === role_1.default.MANAGER) {
            if (groupId) {
                if (!user.groupIds?.includes(groupId))
                    throw app_error_1.default.authorizationError;
            }
            const routes = await this.routesRepository.find({
                groupIds: groupId ? [groupId] : user.groupIds,
                operatorId,
                pointsOfSaleId: pointOfSaleId,
                label,
            });
            // eslint-disable-next-line array-callback-return
            const filteredRoutes = routes.filter(route => {
                const checkRoutesGroups = route.groupIds.some(groupId => !user.groupIds?.includes(groupId));
                if (!checkRoutesGroups)
                    return route;
            });
            if (isNaN(offset) && isNaN(limit)) {
                return {
                    routes: filteredRoutes,
                    count: filteredRoutes.length,
                };
            }
            return {
                routes: filteredRoutes.slice(isNaN(offset) ? 0 : offset, isNaN(offset) ? limit + 0 : limit + offset),
                count: filteredRoutes.length,
            };
        }
        if (user.role === role_1.default.OWNER) {
            if (groupId) {
                const group = await this.groupsRepository.findOne({
                    by: 'id',
                    value: groupId,
                });
                if (group?.ownerId !== user.id)
                    throw app_error_1.default.authorizationError;
            }
            const result = await this.routesRepository.findAndCount({
                ownerId: user.id,
                groupIds: groupId ? [groupId] : undefined,
                operatorId,
                pointsOfSaleId: pointOfSaleId,
                label,
                offset,
                limit,
            });
            return result;
        }
        if (user.role === role_1.default.OPERATOR) {
            if (groupId) {
                if (!user.groupIds?.includes(groupId))
                    throw app_error_1.default.authorizationError;
            }
            const result = await this.routesRepository.findAndCount({
                operatorId: user.id,
                pointsOfSaleId: pointOfSaleId,
                label,
                offset,
                limit,
            });
            return result;
        }
        throw app_error_1.default.unknownError;
    }
};
ListRoutesServiceV2 = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('RoutesRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], ListRoutesServiceV2);
exports.default = ListRoutesServiceV2;
