"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const collection_1 = __importDefault(require("../../../contracts/entities/collection"));
const mikro_collection_1 = __importDefault(require("../entities/mikro-collection"));
class CollectionsMapper {
    static map(data) {
        const collection = data instanceof mikro_collection_1.default
            ? new collection_1.default()
            : new mikro_collection_1.default();
        Object.assign(collection, data);
        return collection;
    }
}
exports.default = CollectionsMapper;
