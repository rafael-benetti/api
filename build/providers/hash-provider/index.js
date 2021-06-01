"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const hash_provider_1 = __importDefault(require("./contracts/models/hash-provider"));
const brcypt_hash_provider_1 = __importDefault(require("./implementations/bcrypt/brcypt-hash-provider"));
tsyringe_1.container.registerSingleton('HashProvider', brcypt_hash_provider_1.default);
