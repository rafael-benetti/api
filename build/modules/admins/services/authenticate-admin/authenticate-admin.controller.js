"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const authenticate_admin_service_1 = __importDefault(require("./authenticate-admin.service"));
class AuthenticateAdminController {
    static async handle(req, res) {
        const { email, password } = req.body;
        const authenticateAdminService = tsyringe_1.container.resolve(authenticate_admin_service_1.default);
        const { admin, token } = await authenticateAdminService.execute({
            email,
            password,
        });
        return res.json({
            admin,
            token,
        });
    }
}
exports.default = AuthenticateAdminController;
