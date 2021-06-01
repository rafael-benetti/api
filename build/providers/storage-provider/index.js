"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const storage_provider_1 = __importDefault(require("./contracts/models/storage.provider"));
const aws_storage_provider_1 = __importDefault(require("./implementations/aws/aws-storage.provider"));
tsyringe_1.container.registerSingleton('StorageProvider', aws_storage_provider_1.default);
