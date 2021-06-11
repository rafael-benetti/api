"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const app_error_1 = __importDefault(require("../../../errors/app-error"));
const celebrate_1 = require("celebrate");
const app_1 = __importDefault(require("../../../../config/app"));
const logger_1 = __importDefault(require("../../../../config/logger"));
const errorHandler = async (error, req, res, _) => {
    if (error instanceof app_error_1.default) {
        return res.status(error.statusCode).json({
            errorCode: error.errorCode,
            message: error.message,
        });
    }
    if (error instanceof celebrate_1.CelebrateError) {
        const object = {};
        error.details.forEach((value, key) => {
            object[key] = value;
        });
        return res.status(400).json({
            errorCode: 'VALIDATION_ERROR',
            details: object,
        });
    }
    if (app_1.default.environment === 'production') {
        return res.status(500).json({
            errorCode: 'INTERNAL_SERVER_ERROR',
            message: 'An internal server error has occurred',
        });
    }
    logger_1.default.error(error);
    return res.status(500).json({ error: error.toString() });
};
exports.default = errorHandler;
