"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = __importDefault(require("../../../contracts/models/route"));
const mikro_route_1 = __importDefault(require("../models/mikro-route"));
class RouteMapper {
    static toEntity(data) {
        const route = new route_1.default();
        Object.assign(route, data);
        return route;
    }
    static toMikroEntity(data) {
        const route = new mikro_route_1.default();
        Object.assign(route, data);
        return route;
    }
}
exports.default = RouteMapper;
