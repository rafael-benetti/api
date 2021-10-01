"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const universal_financial_1 = __importDefault(require("../../../contracts/entities/universal-financial"));
const mikro_universal_financial_1 = __importDefault(require("../entities/mikro-universal-financial"));
class UniversalFinancialMapper {
    static toEntity(data) {
        const universalFinancial = new universal_financial_1.default();
        Object.assign(universalFinancial, data);
        return universalFinancial;
    }
    static toMikroEntity(data) {
        const universalFinancial = new mikro_universal_financial_1.default();
        Object.assign(universalFinancial, data);
        return universalFinancial;
    }
}
exports.default = UniversalFinancialMapper;
