"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_route_dto_1 = __importDefault(require("../../../contracts/dtos/create-route.dto"));
const find_routes_dto_1 = __importDefault(require("../../../contracts/dtos/find-routes.dto"));
const route_1 = __importDefault(require("../../../contracts/models/route"));
const routes_repository_1 = __importDefault(require("../../../contracts/repositories/routes.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const route_mapper_1 = __importDefault(require("../mapper/route.mapper"));
const mikro_route_1 = __importDefault(require("../models/mikro-route"));
class MikroRoutesRepository {
    constructor() {
        this.repository = tsyringe_1.container
            .resolve('OrmProvider')
            .entityManager.getRepository(mikro_route_1.default);
    }
    create(data) {
        const mikroRoute = new mikro_route_1.default(data);
        this.repository.persist(mikroRoute);
        return route_mapper_1.default.toEntity(mikroRoute);
    }
    async findOne({ id, label, pointsOfSaleId, }) {
        const route = await this.repository.findOne({
            ...(id && { id }),
            ...(label && { label }),
            ...(pointsOfSaleId && { pointsOfSaleIds: pointsOfSaleId }),
        });
        return route ? route_mapper_1.default.toEntity(route) : undefined;
    }
    async find({ id, groupIds, operatorId, ownerId, pointsOfSaleId, label, offset, limit, }) {
        const routes = await this.repository.find({
            ...(id && { id }),
            ...(operatorId && { operatorId }),
            ...(groupIds && { groupIds }),
            ...(ownerId && { ownerId }),
            ...(pointsOfSaleId && { pointsOfSaleIds: pointsOfSaleId }),
            ...(label && {
                label: new RegExp(label, 'i'),
                offset,
                limit,
            }),
        });
        return routes.map(route => route_mapper_1.default.toEntity(route));
    }
    async findAndCount({ id, groupIds, operatorId, ownerId, pointsOfSaleId, label, offset, limit, }) {
        const [routes, count] = await this.repository.findAndCount({
            ...(id && { id }),
            ...(operatorId && { operatorId }),
            ...(groupIds && { groupIds }),
            ...(ownerId && { ownerId }),
            ...(pointsOfSaleId && { pointsOfSaleIds: pointsOfSaleId }),
            ...(label && {
                label: new RegExp(label, 'i'),
            }),
        }, {
            limit,
            offset,
        });
        return {
            routes: routes.map(route => route_mapper_1.default.toEntity(route)),
            count,
        };
    }
    save(data) {
        this.repository.persist(route_mapper_1.default.toMikroEntity(data));
    }
    delete(route) {
        const mikroRoute = route_mapper_1.default.toMikroEntity(route);
        this.repository.remove(mikroRoute);
    }
}
exports.default = MikroRoutesRepository;
