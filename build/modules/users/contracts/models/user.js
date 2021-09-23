"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const create_user_dto_1 = __importDefault(require("../dtos/create-user.dto"));
const role_1 = __importDefault(require("../enums/role"));
const operator_stock_1 = __importDefault(require("./operator-stock"));
const permissions_1 = __importDefault(require("./permissions"));
const photo_1 = __importDefault(require("./photo"));
class User {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.email = data.email;
            this.password = data.password;
            this.name = data.name;
            this.role = data.role;
            this.groupIds = data.groupIds;
            this.permissions = data.permissions;
            this.stock = data.stock;
            this.photo = data.photo;
            this.phoneNumber = data.phoneNumber;
            this.isActive = data.isActive;
            this.ownerId = data.ownerId;
            this.deviceToken = data.deviceToken;
            this.type = data.type;
            this.stateRegistration = data.stateRegistration;
            this.document = data.deviceToken;
            this.subscriptionPrice = data.subscriptionPrice;
            this.subscriptionExpirationDate = data.subscriptionExpirationDate;
        }
    }
}
exports.default = User;
