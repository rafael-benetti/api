"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const list_points_of_sale_service_1 = __importDefault(require("./list-points-of-sale.service"));
class ListPointsOfSaleController {
    static async handle(req, res) {
        const { userId } = req;
        const { groupId, label, routeId, operatorId, limit, offset } = req.query;
        const listPointsOfSaleService = tsyringe_1.container.resolve(list_points_of_sale_service_1.default);
        const pointsOfSale = await listPointsOfSaleService.execute({
            userId,
            label: label,
            groupId: groupId,
            operatorId: operatorId,
            routeId: routeId,
            offset: Number(offset),
            limit: Number(limit),
        });
        return res.json(pointsOfSale);
    }
}
exports.default = ListPointsOfSaleController;
