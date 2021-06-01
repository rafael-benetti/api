"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const crypto_1 = require("crypto");
const redis_1 = __importDefault(require("../../../../config/redis"));
const session_provider_1 = __importDefault(require("../../contracts/models/session.provider"));
class RedisSessionProvider {
    constructor() {
        this.client = new ioredis_1.default();
        this.timeToLive = redis_1.default.timeToLive;
    }
    async createToken(userId) {
        const token = crypto_1.randomBytes(128).toString('base64');
        await this.client.set(token, userId);
        await this.client.expire(token, redis_1.default.timeToLive);
        return token;
    }
    async getTokenOwner(token) {
        const userId = await this.client.get(token);
        if (userId)
            await this.client.expire(token, this.timeToLive);
        return userId || undefined;
    }
}
exports.default = RedisSessionProvider;
