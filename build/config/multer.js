"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const MAX_SIZE_TWO_MEGABYTES = 15 * 1024 * 1024;
const storageTypes = {
    local: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path_1.default.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        filename: (req, file, cb) => {
            const fileHash = crypto_1.default.randomBytes(16).toString('hex');
            const fileName = `${fileHash}-${file.originalname}`;
            cb(null, fileName);
        },
    }),
    S3: multer_s3_1.default({
        s3: new aws_sdk_1.default.S3(),
        bucket: process.env.BUCKET_NAME || '',
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto_1.default.randomBytes(16, (err, hash) => {
                if (err)
                    cb(err);
                const filename = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, filename);
            });
        },
        metadata: (req, file, cb) => {
            cb(null, { fieldname: file.fieldname });
        },
    }),
};
exports.default = {
    dest: path_1.default.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: process.env.STORAGE_TYPE === 'S3' ? storageTypes.S3 : storageTypes.local,
    limits: {
        fileSize: MAX_SIZE_TWO_MEGABYTES,
    },
};
