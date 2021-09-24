"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const create_category_service_1 = __importDefault(require("./create-category.service"));
class CreateCategoryController {
    static async handle(req, res) {
        const { userId } = req;
        const { label, boxes } = req.body;
        const createCategoryService = tsyringe_1.container.resolve(create_category_service_1.default);
        const category = await createCategoryService.execute({
            userId,
            label,
            boxes,
        });
        return res.json(category);
    }
}
exports.default = CreateCategoryController;
