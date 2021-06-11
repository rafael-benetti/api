"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_product_log_dto_1 = __importDefault(require("../../../contracts/dtos/create-product-log.dto"));
const find_product_logs_dto_1 = __importDefault(require("../../../contracts/dtos/find-product-logs.dto"));
const product_log_1 = __importDefault(require("../../../contracts/entities/product-log"));
const product_logs_repository_1 = __importDefault(require("../../../contracts/repositories/product-logs.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const mikro_product_log_1 = __importDefault(require("../entities/mikro-product-log"));
const product_log_mapper_1 = __importDefault(require("../mappers/product-log-mapper"));
class MikroProductLogsRepository {
    constructor() {
        this.repository = tsyringe_1.container
            .resolve('OrmProvider')
            .entityManager.getRepository(mikro_product_log_1.default);
    }
    create(data) {
        const productLog = new mikro_product_log_1.default(data);
        this.repository.persist(productLog);
        return product_log_mapper_1.default.map(productLog);
    }
    async find(data) {
        const { groupId, startDate, endDate, productType } = data.filters;
        const query = {};
        if (groupId)
            query.groupId = groupId;
        if (productType)
            query.productType = productType;
        if (startDate && endDate) {
            query.createdAt = {
                $gte: startDate,
                $lte: endDate,
            };
        }
        else if (startDate) {
            query.createdAt = {
                $gte: startDate,
            };
        }
        else if (endDate) {
            query.createdAt = {
                $lte: endDate,
            };
        }
        const productLogs = await this.repository.find({ ...query }, {
            limit: data.limit,
            offset: data.offset,
        });
        return productLogs.map(productLog => product_log_mapper_1.default.map(productLog));
    }
    async findOne({ filters, }) {
        const { groupId, logType } = filters;
        const query = {};
        if (groupId)
            query.groupId = groupId;
        if (logType)
            query.logType = logType;
        const productLog = await this.repository.findOne({ ...query });
        return productLog ? product_log_mapper_1.default.map(productLog) : undefined;
    }
}
exports.default = MikroProductLogsRepository;
