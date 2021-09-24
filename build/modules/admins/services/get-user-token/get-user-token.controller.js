"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const get_user_token_service_1 = __importDefault(require("./get-user-token.service"));
class GetUserTokenController {
}
GetUserTokenController.handle = async (request, response) => {
    const { userId } = request.params;
    const { userId: adminId } = request;
    const getUserToken = tsyringe_1.container.resolve(get_user_token_service_1.default);
    const telemetryBoards = await getUserToken.execute({
        adminId,
        userId,
    });
    return response.json(telemetryBoards);
};
exports.default = GetUserTokenController;
