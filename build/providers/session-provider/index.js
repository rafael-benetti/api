"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const session_provider_1 = __importDefault(require("./contracts/models/session.provider"));
const redis_session_provider_1 = __importDefault(require("./implementations/redis/redis-session.provider"));
tsyringe_1.container.registerSingleton('SessionProvider', redis_session_provider_1.default);
