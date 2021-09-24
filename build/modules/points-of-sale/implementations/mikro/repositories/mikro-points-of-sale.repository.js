"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_point_of_sale_dto_1 = __importDefault(require("../../../contracts/dtos/create-point-of-sale.dto"));
const find_point_of_sale_dto_1 = __importDefault(require("../../../contracts/dtos/find-point-of-sale.dto"));
const point_of_sale_1 = __importDefault(require("../../../contracts/models/point-of-sale"));
const points_of_sale_repository_1 = __importDefault(require("../../../contracts/repositories/points-of-sale.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const mikro_point_of_sale_1 = __importDefault(require("../models/mikro-point-of-sale"));
const point_of_sale_mapper_1 = __importDefault(require("../models/point-of-sale-mapper"));
class MikroPointsOfSaleRepository {
    constructor() {
        this.repository = tsyringe_1.container
            .resolve('OrmProvider')
            .entityManager.getRepository(mikro_point_of_sale_1.default);
    }
    create(data) {
        const pointOfSale = new mikro_point_of_sale_1.default(data);
        this.repository.persist(pointOfSale);
        return point_of_sale_mapper_1.default.toApi(pointOfSale);
    }
    async findOne(data) {
        const pointOfSale = await this.repository.findOne({
            ...(data.by && { [data.by]: data.value }),
        }, data.populate);
        return pointOfSale ? point_of_sale_mapper_1.default.toApi(pointOfSale) : undefined;
    }
    async find(data) {
        const [pointsOfSale, count] = await this.repository.findAndCount({
            ...(data.by && { [data.by]: data.value }),
            ...(data.filters?.groupId && { groupId: data.filters.groupId }),
            ...(data.filters?.ownerId && { ownerId: data.filters.ownerId }),
            ...(data.filters?.label && {
                label: new RegExp(data.filters.label, 'i'),
            }),
        }, {
            offset: data.filters?.offset,
            limit: data.filters?.limit,
            ...(data.fields && { fields: data.fields }),
            ...(data.populate && { populate: data.populate }),
        });
        return {
            count,
            pointsOfSale: pointsOfSale.map(pointOfSale => point_of_sale_mapper_1.default.toApi(pointOfSale)),
        };
    }
    save(data) {
        const reference = this.repository.getReference(data.id);
        const pointOfSale = this.repository.assign(reference, data);
        this.repository.persist(pointOfSale);
    }
    delete(data) {
        const reference = this.repository.getReference(data.id);
        const pointOfSale = this.repository.assign(reference, data);
        this.repository.remove(pointOfSale);
    }
}
exports.default = MikroPointsOfSaleRepository;
