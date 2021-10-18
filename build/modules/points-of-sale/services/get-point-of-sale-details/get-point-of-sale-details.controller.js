"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const period_dto_1 = __importDefault(require("../../../machines/contracts/dtos/period.dto"));
const get_point_of_sale_details_service_1 = __importDefault(require("./get-point-of-sale-details.service"));
class GetPointOfSaleDetailsController {
    static async handle(req, res) {
        const { userId } = req;
        const { pointOfSaleId } = req.params;
        const { period, startDate, endDate } = req.query;
        const getPointOfSaleDetailsService = tsyringe_1.container.resolve(get_point_of_sale_details_service_1.default);
        const response = await getPointOfSaleDetailsService.execute({
            pointOfSaleId,
            userId,
            period: period,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
        return res.json(response);
    }
}
exports.default = GetPointOfSaleDetailsController;
