"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
const typeorm_1 = require("typeorm");
const type_machine_category_1 = __importDefault(require("../entities/type-machine-category"));
class MachineCategoriesRepository {
    constructor() {
        this.ormRepository = typeorm_1.getRepository(type_machine_category_1.default);
    }
    async save(machineCategory) {
        await this.ormRepository.save(machineCategory);
    }
    async findById(id) {
        const machineCategory = await this.ormRepository.findOne({ where: { id } });
        return machineCategory;
    }
    async listAllCategories(userId) {
        const machineCategories = this.ormRepository.find({
            where: { ownerId: userId },
        });
        return machineCategories;
    }
}
exports.default = MachineCategoriesRepository;
