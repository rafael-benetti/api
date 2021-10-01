"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const list_routes_service_v2_1 = __importDefault(require("./list-routes.service.v2"));
class ListRoutesControllerV2 {
    static async handle(req, res) {
        const { userId } = req;
        const { groupId, operatorId, pointOfSaleId, label, limit, offset, } = req.query;
        const listRoutesService = tsyringe_1.container.resolve(list_routes_service_v2_1.default);
        const routes = await listRoutesService.execute({
            userId,
            limit: Number(limit),
            offset: Number(offset),
            groupId: groupId,
            operatorId: operatorId,
            pointOfSaleId: pointOfSaleId,
            label: label,
        });
        return res.json(routes);
    }
}
exports.default = ListRoutesControllerV2;
