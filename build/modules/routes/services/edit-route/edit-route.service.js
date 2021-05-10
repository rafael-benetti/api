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
const groups_repository_1 = __importDefault(require("../../../groups/contracts/repositories/groups.repository"));
const route_1 = __importDefault(require("../../contracts/models/route"));
const routes_repository_1 = __importDefault(require("../../contracts/repositories/routes.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const machines_repository_1 = __importDefault(require("../../../machines/contracts/repositories/machines.repository"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const points_of_sale_repository_1 = __importDefault(require("../../../points-of-sale/contracts/repositories/points-of-sale.repository"));
let EditRouteService = class EditRouteService {
    constructor(routesRepository, usersRepository, groupsRepository, machinesRepository, pointsOfSaleRepository, ormProvider) {
        this.routesRepository = routesRepository;
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
        this.machinesRepository = machinesRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, routeId, label, operatorId, pointsOfSaleIds, }) {
        const user = await this.usersRepository.findOne({
            by: 'id',
            value: userId,
        });
        if (!user)
            throw app_error_1.default.userNotFound;
        const route = await this.routesRepository.findOne({
            id: routeId,
        });
        if (!route)
            throw app_error_1.default.routeNotFound;
        if (user.role !== role_1.default.MANAGER && user.role !== role_1.default.OWNER)
            throw app_error_1.default.authorizationError;
        if (user.role === role_1.default.MANAGER) {
            if (!user.permissions?.editRoutes)
                throw app_error_1.default.authorizationError;
            if (user.groupIds?.some(groupId => !route.groupIds.includes(groupId)))
                throw app_error_1.default.authorizationError;
        }
        if (user.role === role_1.default.OWNER) {
            const userGroups = await this.groupsRepository.find({
                filters: {
                    ownerId: user.id,
                },
            });
            const userGrupIds = userGroups.map(group => group.id);
            if (route.groupIds.some(groupId => !userGrupIds.includes(groupId)))
                throw app_error_1.default.authorizationError;
        }
        const { pointsOfSale } = await this.pointsOfSaleRepository.find({
            by: 'id',
            value: pointsOfSaleIds,
        });
        if (pointsOfSaleIds && pointsOfSale.length !== pointsOfSaleIds.length)
            throw app_error_1.default.pointOfSaleNotFound;
        if (label && label !== route.label) {
            const checkRouteExists = await this.routesRepository.findOne({
                label,
                ownerId: route.ownerId,
            });
            if (checkRouteExists)
                throw app_error_1.default.labelAlreadyInUsed;
            route.label = label;
        }
        const groupIds = [
            ...new Set(pointsOfSaleIds
                ? pointsOfSale.map(pointOfSale => pointOfSale.groupId)
                : route.groupIds),
        ];
        if (groupIds !== undefined) {
            if (user.role === role_1.default.MANAGER)
                if (user.groupIds?.some(groupId => !groupIds.includes(groupId)))
                    throw app_error_1.default.authorizationError;
            if (user.role === role_1.default.OWNER) {
                const userGroups = await this.groupsRepository.find({
                    filters: {
                        ownerId: user.id,
                    },
                });
                const userGrupIds = userGroups.map(group => group.id);
                if (groupIds.some(groupId => !userGrupIds.includes(groupId)))
                    throw app_error_1.default.authorizationError;
            }
            route.groupIds = groupIds;
        }
        if (operatorId !== undefined) {
            if (operatorId === null && route.operatorId !== null) {
                const { machines } = await this.machinesRepository.find({
                    operatorId: route.operatorId,
                    routeId: route.id,
                });
                machines.forEach(machine => {
                    machine.operatorId = undefined;
                    this.machinesRepository.save(machine);
                });
                route.operatorId = undefined;
            }
            else {
                const operator = await this.usersRepository.findOne({
                    by: 'id',
                    value: operatorId,
                });
                if (!operator)
                    throw app_error_1.default.userNotFound;
                if (groupIds.some(groupId => !operator?.groupIds?.includes(groupId)))
                    throw app_error_1.default.authorizationError;
                route.operatorId = operatorId;
            }
        }
        if (pointsOfSaleIds) {
            pointsOfSale.forEach(pointOfSale => {
                pointOfSale.routeId = route.id;
                this.pointsOfSaleRepository.save(pointOfSale);
            });
            const { machines } = await this.machinesRepository.find({
                pointOfSaleId: pointsOfSaleIds,
            });
            machines.forEach(machine => {
                machine.operatorId = operatorId || route.operatorId;
                this.machinesRepository.save(machine);
            });
            const pointsOfSaleToEditIds = route.pointsOfSaleIds.filter(pointOfSaleId => !pointsOfSaleIds.includes(pointOfSaleId));
            const pointsOfSaleToEdit = (await this.pointsOfSaleRepository.find({
                by: 'id',
                value: pointsOfSaleToEditIds,
            })).pointsOfSale;
            pointsOfSaleToEdit.forEach(p => {
                p.routeId = undefined;
                this.pointsOfSaleRepository.save(p);
            });
            route.pointsOfSaleIds = pointsOfSaleIds;
        }
        this.routesRepository.save(route);
        await this.ormProvider.commit();
        return route;
    }
};
EditRouteService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('RoutesRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('MachinesRepository')),
    __param(4, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(5, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], EditRouteService);
exports.default = EditRouteService;
