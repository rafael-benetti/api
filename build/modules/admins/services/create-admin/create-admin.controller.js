"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const create_admin_service_1 = __importDefault(require("./create-admin.service"));
class CreateAdminController {
}
CreateAdminController.handle = async (req, res) => {
    const { email, name } = req.body;
    const createAdmin = tsyringe_1.container.resolve(create_admin_service_1.default);
    const admin = await createAdmin.execute({
        email,
        name,
    });
    return res.json(admin);
};
exports.default = CreateAdminController;
