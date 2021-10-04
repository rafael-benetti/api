"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_log_dto_1 = __importDefault(require("../../../contracts/dtos/create-log.dto"));
const list_log_dto_1 = __importDefault(require("../../../contracts/dtos/list-log.dto"));
const log_1 = __importDefault(require("../../../contracts/models/log"));
const logs_repository_1 = __importDefault(require("../../../contracts/repositories/logs-repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const log_mapper_1 = __importDefault(require("../models/log-mapper"));
const mikro_log_1 = __importDefault(require("../models/mikro-log"));
class MikroLogsRepository {
    constructor() {
        this.repository = tsyringe_1.container
            .resolve('OrmProvider')
            .entityManager.getRepository(mikro_log_1.default);
    }
    create(data) {
        const mikroLog = new mikro_log_1.default(data);
        this.repository.persist(mikroLog);
        return log_mapper_1.default.toEntity(mikroLog);
    }
    async findAndCount({ filters, limit, offset, }) {
        const [mikroLogs, count] = await this.repository.findAndCount({
            ...(filters.startDate && { createdAt: { $gte: filters.startDate } }),
            ...(filters.endDate && { createdAt: { $lte: filters.endDate } }),
            ...(filters.type && { type: { $in: filters.type } }),
            ...(filters.ownerId && { ownerId: filters.ownerId }),
        }, {
            limit,
            offset,
            orderBy: {
                createdAt: 'DESC',
            },
            populate: [
                'user',
                'machine',
                'group',
                'pos',
                'route',
                'collection',
                'affectedGroup',
                'owner',
                'createdByUser',
                'destination',
            ],
        });
        return {
            logs: mikroLogs.map(mikroLog => log_mapper_1.default.toEntity(mikroLog)),
            count,
        };
    }
}
exports.default = MikroLogsRepository;
