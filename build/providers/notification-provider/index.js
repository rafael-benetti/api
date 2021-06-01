"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const notification_provider_1 = __importDefault(require("./contracts/notification.provider"));
const fcm_provider_1 = __importDefault(require("./implementations/fcm.provider"));
tsyringe_1.container.registerSingleton('NotificationProvider', fcm_provider_1.default);
