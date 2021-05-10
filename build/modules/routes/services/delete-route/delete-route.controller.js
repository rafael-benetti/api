"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const delete_route_service_1 = __importDefault(require("./delete-route.service"));
class DeleteRouteController {
    static async handle(req, res) {
        const { userId } = req;
        const { routeId } = req.params;
        const deleteRouteService = tsyringe_1.container.resolve(delete_route_service_1.default);
        await deleteRouteService.execute({
            routeId,
            userId,
        });
        return res.json().status(204);
    }
}
exports.default = DeleteRouteController;
