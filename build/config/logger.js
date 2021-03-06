"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const logger = {
    info: debug_1.default('api:info'),
    error: debug_1.default('api:error'),
};
exports.default = logger;
