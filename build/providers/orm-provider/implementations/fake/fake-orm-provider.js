"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orm_provider_1 = __importDefault(require("../../contracts/models/orm-provider"));
class FakeOrmProvider {
    constructor() {
        this.forkMiddleware = (req, res, next) => {
            return next;
        };
    }
    connect() {
        throw new Error('Method not implemented.');
    }
    clear() {
        throw new Error('Method not implemented.');
    }
    async commit() {
        return undefined;
    }
}
exports.default = FakeOrmProvider;
