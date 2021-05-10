"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const create_route_service_1 = __importDefault(require("./create-route.service"));
class CreateRouteController {
    static async handle(req, res) {
        const { userId } = req;
        const { pointsOfSaleIds, label, operatorId } = req.body;
        const createRouteService = tsyringe_1.container.resolve(create_route_service_1.default);
        const route = await createRouteService.execute({
            userId,
            pointsOfSaleIds,
            label,
            operatorId,
        });
        return res.json(route);
    }
}
exports.default = CreateRouteController;
