"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = __importDefault(require("../../../config/app"));
const logger_1 = __importDefault(require("../../../config/logger"));
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const tsyringe_1 = require("tsyringe");
const orm_provider_1 = __importDefault(require("../../../providers/orm-provider/contracts/models/orm-provider"));
const morgan_1 = __importDefault(require("morgan"));
require("../../container/index");
const router_1 = __importDefault(require("./router"));
const error_handler_1 = __importDefault(require("./middlewares/error-handler"));
const start = async () => {
    const ormProvider = tsyringe_1.container.resolve('OrmProvider');
    await ormProvider.connect();
    const app = express_1.default();
    app.use(express_1.default.json());
    app.use(cors_1.default());
    app.use(morgan_1.default('dev'));
    app.use(ormProvider.forkMiddleware);
    app.use(router_1.default);
    app.use(error_handler_1.default);
    app.listen(app_1.default.port, () => {
        logger_1.default.info(`🎰 - App running on port ${app_1.default.port}`);
    });
};
start();
