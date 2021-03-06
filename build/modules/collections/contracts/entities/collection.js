"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const machine_1 = __importDefault(require("../../../machines/contracts/models/machine"));
const create_collection_dto_1 = __importDefault(require("../dtos/create-collection.dto"));
const box_collection_1 = __importDefault(require("../interfaces/box-collection"));
const geolocation_dto_1 = __importDefault(require("../dtos/geolocation.dto"));
class Collection {
    constructor(data) {
        if (data) {
            this.id = uuid_1.v4();
            this.previousCollectionId = data.previousCollectionId;
            this.machineId = data.machineId;
            this.groupId = data.groupId;
            this.userId = data.userId;
            this.pointOfSaleId = data.pointOfSaleId;
            this.routeId = data.routeId;
            this.observations = data.observations;
            if (data.date === undefined) {
                this.date = new Date();
            }
            else {
                this.date = data.date;
            }
            this.boxCollections = data.boxCollections;
            this.reviewedData = data.reviewedData;
        }
    }
}
exports.default = Collection;
