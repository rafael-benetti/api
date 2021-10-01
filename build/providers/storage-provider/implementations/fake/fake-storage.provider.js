"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upload_file_response_dto_1 = __importDefault(require("../../contracts/dtos/upload-file-response.dto"));
const storage_provider_1 = __importDefault(require("../../contracts/models/storage.provider"));
const uuid_1 = require("uuid");
class FakeStorageProvider {
    async uploadFile(file) {
        return {
            key: uuid_1.v4(),
            downloadUrl: `https://cdn.skilljob.com/${file}`,
        };
    }
    async deleteFile(_) {
        return undefined;
    }
}
exports.default = FakeStorageProvider;
