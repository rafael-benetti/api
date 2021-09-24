"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const create_telemetry_board_service_1 = __importDefault(require("./create-telemetry-board.service"));
class CreateTelemetryBoardController {
}
CreateTelemetryBoardController.validate = celebrate_1.celebrate({
    body: {
        ownerId: celebrate_1.Joi.string().uuid().required(),
        integratedCircuitCardId: celebrate_1.Joi.string(),
    },
});
CreateTelemetryBoardController.handle = async (req, res) => {
    const { ownerId, integratedCircuitCardId } = req.body;
    const createTelemetryBoard = tsyringe_1.container.resolve(create_telemetry_board_service_1.default);
    const telemetryBoard = await createTelemetryBoard.execute({
        ownerId,
        integratedCircuitCardId,
    });
    return res.json(telemetryBoard);
};
exports.default = CreateTelemetryBoardController;
