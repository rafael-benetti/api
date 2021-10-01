"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const universal_financial_1 = __importDefault(require("../../../contracts/entities/universal-financial"));
const universal_financial_repository_1 = __importDefault(require("../../../contracts/repositories/universal-financial.repository"));
const mikro_orm_provider_1 = __importDefault(require("../../../../../providers/orm-provider/implementations/mikro/mikro-orm-provider"));
const tsyringe_1 = require("tsyringe");
const mikro_universal_financial_1 = __importDefault(require("../entities/mikro-universal-financial"));
const universal_financial_mapper_1 = __importDefault(require("../mappers/universal-financial.mapper"));
class MikroUniversalFinancialRepository {
    constructor() {
        this.repository = tsyringe_1.container
            .resolve('OrmProvider')
            .entityManager.getRepository(mikro_universal_financial_1.default);
    }
    async find({ date, groupId, }) {
        const universalFinancial = await this.repository.find({
            groupId,
            ...(date?.start && {
                date: {
                    $gte: date.start,
                },
            }),
            ...(date?.end && {
                date: {
                    $lte: date.end,
                },
            }),
        });
        return universalFinancial.map(item => universal_financial_mapper_1.default.toEntity(item));
    }
}
exports.default = MikroUniversalFinancialRepository;
