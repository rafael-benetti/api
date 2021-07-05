"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const reset_password_service_1 = __importDefault(require("./reset-password.service"));
class ResetPasswordController {
}
ResetPasswordController.handle = async (req, res) => {
    const { resetPasswordToken } = req.body;
    const resetPassword = tsyringe_1.container.resolve(reset_password_service_1.default);
    await resetPassword.execute({
        resetPasswordToken,
    });
    return res.status(204).send();
};
exports.default = ResetPasswordController;
