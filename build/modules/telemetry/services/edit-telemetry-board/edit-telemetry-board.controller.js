"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const edit_telemetry_board_service_1 = __importDefault(require("./edit-telemetry-board.service"));
class EditTelemetryBoardController {
}
EditTelemetryBoardController.validate = celebrate_1.celebrate({
    body: {
        groupId: celebrate_1.Joi.string().uuid().required(),
    },
    params: {
        telemetryId: celebrate_1.Joi.number().required(),
    },
});
EditTelemetryBoardController.handle = async (req, res) => {
    const { userId } = req;
    const { telemetryId } = req.params;
    const { groupId } = req.body;
    const editTelemetryBoard = tsyringe_1.container.resolve(edit_telemetry_board_service_1.default);
    const telemetryBoard = await editTelemetryBoard.execute({
        userId,
        telemetryId,
        groupId,
    });
    return res.json(telemetryBoard);
};
exports.default = EditTelemetryBoardController;
