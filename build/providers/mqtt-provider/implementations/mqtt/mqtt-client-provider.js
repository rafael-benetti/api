"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../../../config/logger"));
const publish_mqtt_dto_1 = __importDefault(require("../../contracts/dtos/publish-mqtt.dto"));
const mqtt_provider_1 = __importDefault(require("../../contracts/models/mqtt-provider"));
const mqtt_1 = __importDefault(require("mqtt"));
class MqttClientProvider {
    constructor() {
        this.client = mqtt_1.default.connect('mqtt://broker.sttigma.com', {
            clientId: 'sttigma-api',
            port: 1883,
            protocol: 'mqtt',
        });
    }
    async publish({ payload, topic }) {
        logger_1.default.info(this.client.connected);
        this.client.publish(topic, payload, {
            qos: 1,
        });
    }
}
exports.default = MqttClientProvider;
