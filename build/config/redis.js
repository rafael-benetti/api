"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redisConfig = {
    timeToLive: Number.parseInt(process.env.REDIS_TTL, 10),
};
exports.default = redisConfig;
