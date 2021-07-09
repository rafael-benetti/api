"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const period_dto_1 = __importDefault(require("../../../machines/contracts/dtos/period.dto"));
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const detail_group_service_v2_1 = __importDefault(require("./detail-group.service.v2"));
class DetailGroupControllerV2 {
    static async handle(req, res) {
        const { userId } = req;
        const { groupId } = req.params;
        const { startDate, endDate, period } = req.query;
        const detailGroupService = tsyringe_1.container.resolve(detail_group_service_v2_1.default);
        const groupDetail = await detailGroupService.execute({
            userId,
            groupId,
            period: period,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
        return res.json(groupDetail);
    }
}
exports.default = DetailGroupControllerV2;
DetailGroupControllerV2.validate = celebrate_1.celebrate({
    query: {
        startDate: celebrate_1.Joi.date(),
        endDate: celebrate_1.Joi.date(),
        period: celebrate_1.Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY'),
    },
});
