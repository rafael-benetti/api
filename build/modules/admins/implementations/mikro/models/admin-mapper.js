"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_1 = __importDefault(require("../../../contracts/models/admin"));
const mikro_admin_1 = __importDefault(require("./mikro-admin"));
class AdminMapper {
    static toApi(data) {
        const admin = new admin_1.default();
        Object.assign(admin, data);
        return admin;
    }
    static toOrm(data) {
        const admin = new mikro_admin_1.default();
        Object.assign(admin, data);
        return admin;
    }
}
exports.default = AdminMapper;
