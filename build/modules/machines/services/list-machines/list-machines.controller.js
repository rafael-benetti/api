"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const list_machines_service_1 = __importDefault(require("./list-machines.service"));
class ListMachinesController {
    static async handle(req, res) {
        const { userId } = req;
        const { lean, categoryId, groupId, routeId, pointOfSaleId, serialNumber, isActive, telemetryStatus, limit, offset,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
         } = req.query;
        const listMachinesService = tsyringe_1.container.resolve(list_machines_service_1.default);
        const machines = await listMachinesService.execute({
            userId,
            categoryId: categoryId,
            groupId: groupId,
            pointOfSaleId: pointOfSaleId,
            routeId: routeId,
            serialNumber: serialNumber,
            isActive: isActive?.toString() === 'true',
            telemetryStatus,
            limit: Number(limit),
            offset: Number(offset),
            lean: lean?.toString() === 'true',
        });
        return res.json(machines);
    }
}
exports.default = ListMachinesController;
