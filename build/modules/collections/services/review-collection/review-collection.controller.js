"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const review_collection_service_1 = __importDefault(require("./review-collection.service"));
class ReviewCollectionController {
    static async handle(req, res) {
        const { userId } = req;
        const { collectionId } = req.params;
        const reviewCollectionService = tsyringe_1.container.resolve(review_collection_service_1.default);
        await reviewCollectionService.execute({
            collectionId,
            userId,
        });
        return res.status(204).json();
    }
}
ReviewCollectionController.validate = celebrate_1.celebrate({
    params: {
        collectionId: celebrate_1.Joi.string().required(),
    },
});
exports.default = ReviewCollectionController;
