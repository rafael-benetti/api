"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const aws_1 = __importDefault(require("../../../../config/aws"));
const upload_file_response_dto_1 = __importDefault(require("../../contracts/dtos/upload-file-response.dto"));
const storage_provider_1 = __importDefault(require("../../contracts/models/storage.provider"));
class AwsStorageProvider {
    constructor() {
        this.s3 = new aws_sdk_1.default.S3({
            accessKeyId: aws_1.default.accessKey,
            secretAccessKey: aws_1.default.secretKey,
        });
    }
    async uploadFile(file) {
        const payload = {
            Body: file,
            Bucket: aws_1.default.bucket,
            ACL: 'public-read',
            Key: uuid_1.v4(),
            ContentType: file.mimetype,
        };
        const response = await this.s3.upload(payload).promise();
        return {
            key: response.Key,
            downloadUrl: response.Location,
        };
    }
    async deleteFile(key) {
        await this.s3
            .deleteObject({
            Bucket: aws_1.default.bucket,
            Key: key,
        })
            .promise();
    }
}
exports.default = AwsStorageProvider;
