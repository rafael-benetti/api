"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const orm_provider_1 = __importDefault(require("./contracts/models/orm-provider"));
const mikro_orm_provider_1 = __importDefault(require("./implementations/mikro/mikro-orm-provider"));
tsyringe_1.container.registerSingleton('OrmProvider', mikro_orm_provider_1.default);
