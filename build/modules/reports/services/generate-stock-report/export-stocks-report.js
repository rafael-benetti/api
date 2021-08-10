"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-duplicates */
const logger_1 = __importDefault(require("../../../../config/logger"));
const product_1 = __importDefault(require("../../../users/contracts/models/product"));
const exceljs_1 = __importDefault(require("exceljs"));
async function exportGroupsReport({ columnsPrizes, columnsSupliers, users, }) {
    const workbook = new exceljs_1.default.Workbook();
    const sheet = workbook.addWorksheet('tabela 1');
    const columnsPrizesLabel = columnsPrizes.map(prize => {
        return { key: prize.id, header: prize.label };
    });
    const columnsSupliersLabel = columnsSupliers.map(supplier => {
        return { key: supplier.id, header: supplier.label };
    });
    const values = [
        { key: 'Usuário', header: 'Usuário' },
        { key: 'Parceria', header: 'Parceria' },
        ...columnsPrizesLabel,
        ...columnsSupliersLabel,
    ];
    const columns = values.map(value => {
        return {
            key: value.key,
            header: value.header,
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
            },
            width: 15,
        };
    });
    sheet.columns = columns;
    logger_1.default.info(sheet.columnCount);
    logger_1.default.info(sheet.columns);
    users.forEach(item => {
        const groupLabels = `${item.groupLabels}`;
        const row = {
            Usuário: item.name,
            Parceria: groupLabels,
        };
        columnsPrizes.forEach(value => {
            row[value.id] =
                item.prizes?.find(prize => prize.id === value.id)?.quantity || 0;
        });
        columnsSupliers.forEach(value => {
            row[value.id] =
                item.prizes?.find(suplie => suplie.label === value.id)?.quantity || 0;
        });
        sheet.addRow(row);
    });
    return workbook;
}
exports.default = exportGroupsReport;
