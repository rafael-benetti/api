"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../../../contracts/models/user"));
const mikro_user_1 = __importDefault(require("./mikro-user"));
class UserMapper {
    static toApi(data) {
        const user = new user_1.default();
        Object.assign(user, data);
        return user;
    }
    static toOrm(data) {
        const user = new mikro_user_1.default();
        Object.assign(user, data);
        return user;
    }
}
exports.default = UserMapper;
