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
const points_of_sale_repository_1 = __importDefault(require("../../../points-of-sale/contracts/repositories/points-of-sale.repository"));
const routes_repository_1 = __importDefault(require("../../contracts/repositories/routes.repository"));
const role_1 = __importDefault(require("../../../users/contracts/enums/role"));
const users_repository_1 = __importDefault(require("../../../users/contracts/repositories/users.repository"));
const orm_provider_1 = __importDefault(require("../../../../providers/orm-provider/contracts/models/orm-provider"));
const app_error_1 = __importDefault(require("../../../../shared/errors/app-error"));
const tsyringe_1 = require("tsyringe");
let DeleteRouteService = class DeleteRouteService {
    constructor(routesRepository, usersRepository, groupsRepository, pointsOfSaleRepository, ormProvider) {
        this.routesRepository = routesRepository;
        this.usersRepository = usersRepository;
        this.groupsRepository = groupsRepository;
        this.pointsOfSaleRepository = pointsOfSaleRepository;
        this.ormProvider = ormProvider;
    }
    async execute({ userId, routeId }) {
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
            if (!user.permissions?.deleteRoutes)
                throw app_error_1.default.authorizationError;
            if (route.groupIds?.some(groupId => !user.groupIds?.includes(groupId)))
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
            by: 'routeId',
            value: route.id,
        });
        pointsOfSale.forEach(pointOfSale => {
            pointOfSale.routeId = undefined;
            this.pointsOfSaleRepository.save(pointOfSale);
        });
        this.routesRepository.delete(route);
        await this.ormProvider.commit();
    }
};
DeleteRouteService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('RoutesRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __param(2, tsyringe_1.inject('GroupsRepository')),
    __param(3, tsyringe_1.inject('PointsOfSaleRepository')),
    __param(4, tsyringe_1.inject('OrmProvider')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], DeleteRouteService);
exports.default = DeleteRouteService;
