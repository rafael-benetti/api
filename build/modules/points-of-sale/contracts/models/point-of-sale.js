"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const create_point_of_sale_dto_1 = __importDefault(require("../dtos/create-point-of-sale.dto"));
const address_1 = __importDefault(require("./address"));
class PointOfSale {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.ownerId = data.ownerId;
            this.groupId = data.groupId;
            this.label = data.label;
            this.contactName = data.contactName;
            this.primaryPhoneNumber = data.primaryPhoneNumber;
            this.secondaryPhoneNumber = data.secondaryPhoneNumber;
            this.rent = data.rent;
            this.isPercentage = data.isPercentage;
            this.address = data.address;
        }
    }
}
exports.default = PointOfSale;
