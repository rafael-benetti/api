"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const period_dto_1 = __importDefault(require("../../../machines/contracts/dtos/period.dto"));
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const detail_group_service_1 = __importDefault(require("./detail-group.service"));
class DetailGroupController {
    static async handle(req, res) {
        const { userId } = req;
        const { groupId } = req.params;
        const { startDate, endDate, period } = req.query;
        const detailGroupService = tsyringe_1.container.resolve(detail_group_service_1.default);
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
DetailGroupController.validate = celebrate_1.celebrate({
    query: {
        startDate: celebrate_1.Joi.date(),
        endDate: celebrate_1.Joi.date(),
        period: celebrate_1.Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY'),
    },
});
exports.default = DetailGroupController;
