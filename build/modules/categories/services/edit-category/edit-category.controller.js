"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const edit_category_service_1 = __importDefault(require("./edit-category.service"));
class EditCategoryController {
    static async handle(req, res) {
        const { userId } = req;
        const { label, boxes } = req.body;
        const { categoryId } = req.params;
        const editCategoryService = tsyringe_1.container.resolve(edit_category_service_1.default);
        const category = await editCategoryService.execute({
            userId,
            categoryId,
            label,
            boxes,
        });
        return res.json(category);
    }
}
exports.default = EditCategoryController;
