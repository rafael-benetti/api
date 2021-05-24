"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = __importDefault(require("../../../shared/server/express/middlewares/auth-handler"));
const express_1 = require("express");
const generate_group_report_controller_1 = __importDefault(require("../services/generate-group-report/generate-group-report.controller"));
const generate_machines_report_controller_1 = __importDefault(require("../services/generate-machines-report/generate-machines-report.controller"));
const generate_points_of_sale_report_controller_1 = __importDefault(require("../services/generate-points-of-sale-report/generate-points-of-sale-report.controller"));
const reportsRoutes = express_1.Router();
reportsRoutes.use(auth_handler_1.default);
reportsRoutes.get('/groups', generate_group_report_controller_1.default.validate, generate_group_report_controller_1.default.handle);
reportsRoutes.get('/points-of-sale', generate_points_of_sale_report_controller_1.default.validate, generate_points_of_sale_report_controller_1.default.handle);
reportsRoutes.get('/machines', generate_machines_report_controller_1.default.validate, generate_machines_report_controller_1.default.handle);
exports.default = reportsRoutes;
