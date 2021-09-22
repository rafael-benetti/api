"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const permissions_1 = __importDefault(require("../contracts/models/permissions"));
const manager_permissions_1 = __importDefault(require("./manager-permissions"));
const operator_permissions_1 = __importDefault(require("./operator-permissions"));
const validatePermissions = (data) => {
    if (data.for === 'OPERATOR') {
        return Object.keys(data.permissions).some(key => manager_permissions_1.default.includes(key));
    }
    return Object.keys(data.permissions).some(key => operator_permissions_1.default.includes(key));
};
exports.default = validatePermissions;
