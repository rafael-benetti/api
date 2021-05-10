"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_machine_dto_1 = __importDefault(require("../../../contracts/dtos/create-machine.dto"));
const find_machine_dto_1 = __importDefault(require("../../../contracts/dtos/find-machine.dto"));
const find_machines_dto_1 = __importDefault(require("../../../contracts/dtos/find-machines.dto"));
const machine_1 = __importDefault(require("../../../contracts/models/machine"));
const machines_repository_1 = __importDefault(require("../../../contracts/repositories/machines.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const machine_mapper_1 = __importDefault(require("../mapper/machine.mapper"));
const mikro_machine_1 = __importDefault(require("../models/mikro-machine"));
class MikroMachinesRepository {
    constructor() {
        this.repository = tsyringe_1.container
            .resolve('OrmProvider')
            .entityManager.getRepository(mikro_machine_1.default);
    }
    create(data) {
        const mikroMachine = new mikro_machine_1.default(data);
        this.repository.persist(mikroMachine);
        return machine_mapper_1.default.toEntity(mikroMachine);
    }
    async findOne(data) {
        const machine = await this.repository.findOne({
            [data.by]: data.value,
        }, {
            populate: data.populate,
        });
        return machine ? machine_mapper_1.default.toEntity(machine) : undefined;
    }
    async find({ id, ownerId, groupIds, operatorId, categoryId, pointOfSaleId, serialNumber, isActive, telemetryBoardId, limit, offset, populate, }) {
        const [result, count] = await this.repository.findAndCount({
            ...(id && { id }),
            ...(operatorId && { operatorId }),
            ...(ownerId && { ownerId }),
            ...(groupIds && { groupId: groupIds }),
            ...(telemetryBoardId && { telemetryBoardId }),
            ...(categoryId && { categoryId }),
            ...(pointOfSaleId !== undefined && {
                locationId: pointOfSaleId === 'null' ? null : pointOfSaleId,
            }),
            ...(serialNumber && {
                serialNumber: new RegExp(serialNumber, 'i'),
            }),
            ...(isActive !== undefined && { isActive }),
        }, {
            limit,
            offset,
            populate,
        });
        const machines = result.map(machine => machine_mapper_1.default.toEntity(machine));
        return { machines, count };
    }
    save(data) {
        this.repository.persist(machine_mapper_1.default.toMikroEntity(data));
    }
}
exports.default = MikroMachinesRepository;
