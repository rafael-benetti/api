"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const get_user_profile_service_1 = __importDefault(require("./get-user-profile.service"));
class GetUserProfileController {
}
GetUserProfileController.handle = async (req, res) => {
    const { userId } = req;
    const getUserProfile = tsyringe_1.container.resolve(get_user_profile_service_1.default);
    const user = await getUserProfile.execute({
        userId,
    });
    return res.json(user);
};
exports.default = GetUserProfileController;
