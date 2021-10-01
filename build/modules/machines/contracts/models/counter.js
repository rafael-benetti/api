"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const create_counter_dto_1 = __importDefault(require("../dtos/create-counter.dto"));
class Counter {
    constructor(data) {
        if (data) {
            this.id = data.id || uuid_1.v4();
            this.counterTypeId = data.counterTypeId;
            this.hasMechanical = data.hasMechanical;
            this.hasDigital = data.hasDigital;
            this.pin = data.pin;
        }
    }
}
exports.default = Counter;
