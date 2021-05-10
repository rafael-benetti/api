"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_provider_1 = __importDefault(require("../../../../providers/session-provider/contracts/models/session.provider"));
const app_error_1 = __importDefault(require("../../../errors/app-error"));
const tsyringe_1 = require("tsyringe");
async function authHandler(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw app_error_1.default.tokenIsMissing;
    }
    const sessionProvider = tsyringe_1.container.resolve('SessionProvider');
    const [, token] = authHeader.split(' ');
    const userId = await sessionProvider.getTokenOwner(token);
    if (!userId)
        throw app_error_1.default.invalidToken;
    req.userId = userId;
    return next();
}
exports.default = authHandler;
