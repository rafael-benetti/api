"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const create_product_log_dto_1 = __importDefault(require("../dtos/create-product-log.dto"));
class ProductLog {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.groupId = data.groupId;
            this.productName = data.productName;
            this.productType = data.productType;
            this.quantity = data.quantity;
            this.logType = data.logType;
            this.cost = data.cost;
            this.createdAt = new Date();
        }
    }
}
exports.default = ProductLog;
