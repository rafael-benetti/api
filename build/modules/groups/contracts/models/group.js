"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const create_group_dto_1 = __importDefault(require("../dtos/create-group.dto"));
const group_stock_1 = __importDefault(require("./group-stock"));
class Group {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.label = data.label;
            this.isPersonal = data.isPersonal;
            this.stock = {
                prizes: [],
                supplies: [],
            };
            this.ownerId = data.ownerId;
        }
    }
}
exports.default = Group;
