"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const period_dto_1 = __importDefault(require("../../../machines/contracts/dtos/period.dto"));
const tsyringe_1 = require("tsyringe");
const detail_route_service_1 = __importDefault(require("./detail-route.service"));
class DetailRouteController {
    static async handle(req, res) {
        const { userId } = req;
        const { routeId } = req.params;
        const { period } = req.query;
        const detailRouteService = tsyringe_1.container.resolve(detail_route_service_1.default);
        const response = await detailRouteService.execute({
            routeId,
            userId,
            period: period,
        });
        return res.json(response);
    }
}
exports.default = DetailRouteController;
