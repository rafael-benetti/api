"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const point_of_sale_1 = __importDefault(require("../../../contracts/models/point-of-sale"));
const mikro_point_of_sale_1 = __importDefault(require("./mikro-point-of-sale"));
class PointOfSaleMapper {
    static toApi(data) {
        const pointOfSale = new point_of_sale_1.default();
        Object.assign(pointOfSale, data);
        return pointOfSale;
    }
    static toOrm(data) {
        const pointOfSale = new mikro_point_of_sale_1.default();
        Object.assign(pointOfSale, data);
        return pointOfSale;
    }
}
exports.default = PointOfSaleMapper;
