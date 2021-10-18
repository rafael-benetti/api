"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const authenticate_user_service_1 = __importDefault(require("./authenticate-user.service"));
class AuthenticateUserController {
}
AuthenticateUserController.handle = async (req, res) => {
    const { email, password } = req.body;
    const createSession = tsyringe_1.container.resolve(authenticate_user_service_1.default);
    const { token, user } = await createSession.execute({
        email,
        password,
    });
    return res.json({ token, user });
};
exports.default = AuthenticateUserController;
