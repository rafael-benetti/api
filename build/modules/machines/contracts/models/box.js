"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const create_box_dto_1 = __importDefault(require("../dtos/create-box.dto"));
const counter_1 = __importDefault(require("./counter"));
class Box {
    constructor(data) {
        if (data) {
            this.id = data.id || uuid_1.v4();
            this.numberOfPrizes = 0;
            this.currentMoney = 0;
            this.counters = data.counters;
            this.currentMoney = data.currentMoney ? data.currentMoney : 0;
        }
    }
}
exports.default = Box;
