"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const update_user_profile_service_1 = __importDefault(require("./update-user-profile.service"));
class UpdateUserProfileController {
}
UpdateUserProfileController.handle = async (req, res) => {
    const { userId, file } = req;
    const { name, newPassword, password, phoneNumber } = req.body;
    const updateUserProfile = tsyringe_1.container.resolve(update_user_profile_service_1.default);
    const user = await updateUserProfile.execute({
        userId,
        name,
        password: newPassword
            ? {
                new: newPassword,
                old: password,
            }
            : undefined,
        file,
        phoneNumber,
    });
    return res.json(user);
};
exports.default = UpdateUserProfileController;
