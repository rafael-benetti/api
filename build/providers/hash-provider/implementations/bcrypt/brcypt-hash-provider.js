"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hash_provider_1 = __importDefault(require("../../contracts/models/hash-provider"));
const bcrypt_1 = require("bcrypt");
class BcryptHashProvider {
    hash(payload) {
        return bcrypt_1.hashSync(payload, 8);
    }
    compare(payload, hashed) {
        return bcrypt_1.compareSync(payload, hashed);
    }
}
exports.default = BcryptHashProvider;
