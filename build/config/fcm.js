"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fcm_credentials_json_1 = __importDefault(require("../credentials/fcm-credentials.json"));
const credentials = {
    clientEmail: fcm_credentials_json_1.default.client_email,
    privateKey: fcm_credentials_json_1.default.private_key,
};
exports.default = credentials;
