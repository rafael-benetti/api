"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const edit_collection_service_1 = __importDefault(require("./edit-collection.service"));
class EditCollectionController {
    static async handle(req, res) {
        const { userId, files } = req;
        const { machineId, observations, boxCollections, photosToDelete, } = req.body;
        const { collectionId } = req.params;
        const editCollectionService = tsyringe_1.container.resolve(edit_collection_service_1.default);
        const collection = await editCollectionService.execute({
            boxCollections,
            collectionId,
            machineId,
            observations,
            files: files,
            photosToDelete,
            userId,
        });
        return res.json(collection);
    }
}
exports.default = EditCollectionController;
EditCollectionController.validate = celebrate_1.celebrate({
    body: {
        photosToDelete: celebrate_1.Joi.array().items(celebrate_1.Joi.string()),
        machineId: celebrate_1.Joi.string().uuid().required(),
        observations: celebrate_1.Joi.string().required(),
        boxCollections: celebrate_1.Joi.array().items(celebrate_1.Joi.object({
            boxId: celebrate_1.Joi.string().uuid().required(),
            counterCollections: celebrate_1.Joi.array().items(celebrate_1.Joi.object({
                counterTypeLabel: celebrate_1.Joi.string().required(),
                counterId: celebrate_1.Joi.string().required(),
                mechanicalCount: celebrate_1.Joi.number(),
                digitalCount: celebrate_1.Joi.number(),
                userCount: celebrate_1.Joi.number(),
            })),
        })),
    },
});
