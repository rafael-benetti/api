"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_provider_1 = __importDefault(require("../../contracts/models/session.provider"));
const uuid_1 = require("uuid");
class FakeSessionProvider {
    constructor() {
        this.sessions = {};
    }
    async createToken(userId) {
        const sessionToken = uuid_1.v4();
        this.sessions[sessionToken] = userId;
        return sessionToken;
    }
    async getTokenOwner(token) {
        return this.sessions[token];
    }
}
exports.default = FakeSessionProvider;
