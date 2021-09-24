"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const create_collection_service_1 = __importDefault(require("./create-collection.service"));
class CreateCollectionController {
}
exports.default = CreateCollectionController;
CreateCollectionController.validate = celebrate_1.celebrate({
    body: {
        machineId: celebrate_1.Joi.string().uuid().required(),
        observations: celebrate_1.Joi.string().required(),
        startTime: celebrate_1.Joi.date(),
        startLocation: celebrate_1.Joi.object({
            latitude: celebrate_1.Joi.number(),
            longitude: celebrate_1.Joi.number(),
        }),
        endLocation: celebrate_1.Joi.object({
            latitude: celebrate_1.Joi.number(),
            longitude: celebrate_1.Joi.number(),
        }),
        boxCollections: celebrate_1.Joi.array()
            .items(celebrate_1.Joi.object({
            boxId: celebrate_1.Joi.string().uuid().required(),
            prizeCount: celebrate_1.Joi.number(),
            counterCollections: celebrate_1.Joi.array()
                .items(celebrate_1.Joi.object({
                counterId: celebrate_1.Joi.string().required(),
                counterTypeLabel: celebrate_1.Joi.string().required(),
                mechanicalCount: celebrate_1.Joi.number(),
                digitalCount: celebrate_1.Joi.number(),
                userCount: celebrate_1.Joi.number(),
            }))
                .required(),
        }))
            .required(),
    },
});
CreateCollectionController.handle = async (request, response) => {
    const { userId, files } = request;
    const { machineId, observations, boxCollections, startTime, startLocation, endLocation, } = request.body;
    const createCollection = tsyringe_1.container.resolve(create_collection_service_1.default);
    const collection = await createCollection.execute({
        userId,
        machineId,
        observations,
        boxCollections,
        files: files,
        startTime,
        endLocation,
        startLocation,
    });
    return response.status(201).json(collection);
};
