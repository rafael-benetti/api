"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const tsyringe_1 = require("tsyringe");
const get_collections_service_1 = __importDefault(require("./get-collections.service"));
class GetCollectionsController {
}
exports.default = GetCollectionsController;
GetCollectionsController.validate = celebrate_1.celebrate({
    query: {
        machineId: celebrate_1.Joi.string().uuid(),
        limit: celebrate_1.Joi.number().integer().min(0),
        offset: celebrate_1.Joi.number().integer().min(0),
    },
});
GetCollectionsController.handle = async (request, response) => {
    const { userId } = request;
    const { machineId, limit, offset } = request.query;
    const getCollections = tsyringe_1.container.resolve(get_collections_service_1.default);
    const { collections, count } = await getCollections.execute({
        userId,
        machineId,
        limit,
        offset,
    });
    return response.json({ collections, count });
};
