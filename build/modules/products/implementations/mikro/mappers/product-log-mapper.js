"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_log_1 = __importDefault(require("../../../contracts/entities/product-log"));
const mikro_product_log_1 = __importDefault(require("../entities/mikro-product-log"));
class ProductLogMapper {
    static map(data) {
        const productLog = data instanceof product_log_1.default ? new mikro_product_log_1.default() : new product_log_1.default();
        Object.assign(productLog, data);
        return productLog;
    }
}
exports.default = ProductLogMapper;
