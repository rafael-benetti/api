"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const request_password_reset_service_1 = __importDefault(require("./request-password-reset.service"));
class RequestPasswordResetController {
}
RequestPasswordResetController.handle = async (req, res) => {
    const { email } = req.body;
    const requestPasswordReset = tsyringe_1.container.resolve(request_password_reset_service_1.default);
    await requestPasswordReset.execute({
        email,
    });
    return res.status(204).send();
};
exports.default = RequestPasswordResetController;
