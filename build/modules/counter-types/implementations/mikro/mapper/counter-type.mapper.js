"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const counter_type_1 = __importDefault(require("../../../contracts/models/counter-type"));
const mikro_counter_type_1 = __importDefault(require("../models/mikro-counter-type"));
class CounterTypeMapper {
    static toEntity(data) {
        const counterType = new counter_type_1.default();
        Object.assign(counterType, data);
        return counterType;
    }
    static toMikroEntity(data) {
        const counterType = new mikro_counter_type_1.default();
        Object.assign(counterType, data);
        return counterType;
    }
}
exports.default = CounterTypeMapper;
