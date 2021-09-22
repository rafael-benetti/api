"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = __importDefault(require("../../../contracts/models/category"));
const mikro_category_1 = __importDefault(require("../model/mikro-category"));
class CategoryMapper {
    static toEntity(data) {
        const pointOfSale = new category_1.default();
        Object.assign(pointOfSale, data);
        return pointOfSale;
    }
    static toMikroEntity(data) {
        const pointOfSale = new mikro_category_1.default();
        Object.assign(pointOfSale, data);
        return pointOfSale;
    }
}
exports.default = CategoryMapper;
