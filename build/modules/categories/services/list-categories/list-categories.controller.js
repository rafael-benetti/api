"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const list_categories_service_1 = __importDefault(require("./list-categories.service"));
class ListCategoriesController {
    static async handle(req, res) {
        const { userId } = req;
        const listCategoriesService = tsyringe_1.container.resolve(list_categories_service_1.default);
        const category = await listCategoriesService.execute(userId);
        return res.json(category);
    }
}
exports.default = ListCategoriesController;
