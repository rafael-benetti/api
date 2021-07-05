"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awsConfig = {
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET,
};
exports.default = awsConfig;
