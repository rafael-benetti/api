"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const group_1 = __importDefault(require("../../../contracts/models/group"));
const mikro_group_1 = __importDefault(require("./mikro-group"));
class GroupMapper {
    static toApi(data) {
        const group = new group_1.default();
        Object.assign(group, data);
        return group;
    }
    static toOrm(data) {
        const group = new mikro_group_1.default();
        Object.assign(group, data);
        return group;
    }
}
exports.default = GroupMapper;
