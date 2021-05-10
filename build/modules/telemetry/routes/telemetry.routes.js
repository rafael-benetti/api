"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const express_1 = require("express");
const edit_telemetry_board_controller_1 = __importDefault(require("../services/edit-telemetry-board/edit-telemetry-board.controller"));
const list_telemetry_boards_controller_1 = __importDefault(require("../services/list-telemetry-boards/list-telemetry-boards.controller"));
const telemetryRoutes = express_1.Router();
telemetryRoutes.use(auth_handler_1.default);
telemetryRoutes.patch('/:telemetryId', edit_telemetry_board_controller_1.default.validate, edit_telemetry_board_controller_1.default.handle);
telemetryRoutes.get('/', list_telemetry_boards_controller_1.default.handle);
exports.default = telemetryRoutes;
