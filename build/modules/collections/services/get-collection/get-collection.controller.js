"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const get_collection_service_1 = __importDefault(require("./get-collection.service"));
class GetCollectionController {
}
exports.default = GetCollectionController;
GetCollectionController.validate = celebrate_1.celebrate({
    params: {
        collectionId: celebrate_1.Joi.string().uuid(),
    },
});
GetCollectionController.handle = async (request, response) => {
    const { userId } = request;
    const { collectionId } = request.params;
    const getColletionService = tsyringe_1.container.resolve(get_collection_service_1.default);
    const collection = await getColletionService.execute({
        collectionId,
        userId,
    });
    return response.json(collection);
};
