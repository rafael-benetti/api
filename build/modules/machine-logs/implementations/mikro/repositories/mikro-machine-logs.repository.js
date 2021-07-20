"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_machine_log_dto_1 = __importDefault(require("../../../contracts/dtos/create-machine-log.dto"));
const find_machine_logs_dto_1 = __importDefault(require("../../../contracts/dtos/find-machine-logs.dto"));
const machine_log_1 = __importDefault(require("../../../contracts/entities/machine-log"));
const machine_logs_repository_1 = __importDefault(require("../../../contracts/repositories/machine-logs.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const mikro_machine_log_1 = __importDefault(require("../entities/mikro-machine-log"));
const machine_log_mapper_1 = __importDefault(require("../mappers/machine-log.mapper"));
class MikroMachineLogsRepository {
    constructor() {
        this.repository = tsyringe_1.container
            .resolve('OrmProvider')
            .entityManager.getRepository(mikro_machine_log_1.default);
    }
    create(data) {
        const mikroMachineLog = new mikro_machine_log_1.default(data);
        this.repository.persist(mikroMachineLog);
        return machine_log_mapper_1.default.toEntity(mikroMachineLog);
    }
    async find({ machineId, groupId, type, startDate, endDate, fields, populate, limit, offset, }) {
        const machineLogs = await this.repository.find({
            machineId,
            groupId,
            ...(type && { type }),
            ...(startDate && {
                createdAt: {
                    $gte: startDate,
                },
            }),
            ...(endDate && {
                createdAt: {
                    $lte: endDate,
                },
            }),
        }, {
            limit,
            offset,
            orderBy: {
                createdAt: 'DESC',
            },
            populate,
            fields,
        });
        return machineLogs;
    }
    async findAndCount({ machineId, groupId, type, startDate, endDate, fields, populate, limit, offset, }) {
        const [machineLogs, count] = await this.repository.findAndCount({
            machineId,
            groupId,
            ...(type && { type }),
            ...(startDate && {
                createdAt: {
                    $gte: startDate,
                },
            }),
            ...(endDate && {
                createdAt: {
                    $lte: endDate,
                },
            }),
        }, {
            limit,
            offset,
            orderBy: {
                createdAt: 'DESC',
            },
            populate,
            fields,
        });
        return { machineLogs, count };
    }
    save(data) {
        this.repository.persist(machine_log_mapper_1.default.toMikroEntity(data));
    }
}
exports.default = MikroMachineLogsRepository;
