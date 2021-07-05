"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const edit_route_service_1 = __importDefault(require("./edit-route.service"));
class EditRouteController {
    static async handle(req, res) {
        const { userId } = req;
        const { routeId } = req.params;
        const { pointsOfSaleIds, label, operatorId } = req.body;
        const editRouteService = tsyringe_1.container.resolve(edit_route_service_1.default);
        const route = await editRouteService.execute({
            userId,
            label,
            pointsOfSaleIds,
            operatorId,
            routeId,
        });
        return res.json(route);
    }
}
exports.default = EditRouteController;
