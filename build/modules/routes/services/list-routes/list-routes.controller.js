"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const list_routes_service_1 = __importDefault(require("./list-routes.service"));
class ListRoutesController {
    static async handle(req, res) {
        const { userId } = req;
        const listRoutesService = tsyringe_1.container.resolve(list_routes_service_1.default);
        const routes = await listRoutesService.execute({
            userId,
        });
        return res.json(routes);
    }
}
exports.default = ListRoutesController;
