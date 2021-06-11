"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const mqtt_provider_1 = __importDefault(require("./contracts/models/mqtt-provider"));
const mqtt_client_provider_1 = __importDefault(require("./implementations/mqtt/mqtt-client-provider"));
tsyringe_1.container.registerSingleton('MqttProvider', mqtt_client_provider_1.default);
