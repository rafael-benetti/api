"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const create_admin_dto_1 = __importDefault(require("../dtos/create-admin.dto"));
class Admin {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.email = data.email;
            this.password = data.password;
            this.name = data.name;
        }
    }
}
exports.default = Admin;
