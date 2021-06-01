"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_admin_dto_1 = __importDefault(require("../../../contracts/dtos/create-admin.dto"));
const find_admin_dto_1 = __importDefault(require("../../../contracts/dtos/find-admin.dto"));
const admin_1 = __importDefault(require("../../../contracts/models/admin"));
const admins_repository_1 = __importDefault(require("../../../contracts/repositories/admins.repository"));
class FakeAdminsRepository {
    constructor() {
        this.admins = [];
    }
    create(data) {
        const admin = new admin_1.default(data);
        this.admins.push(admin);
        return admin;
    }
    async findOne(data) {
        return this.admins.find(admin => admin[data.by] === data.value);
    }
    save(data) {
        const index = this.admins.findIndex(admin => admin.id === data.id);
        this.admins[index] = data;
    }
    delete(data) {
        const index = this.admins.indexOf(data);
        this.admins.splice(index, 1);
    }
}
exports.default = FakeAdminsRepository;
