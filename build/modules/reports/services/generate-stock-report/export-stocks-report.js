"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-duplicates */
const product_1 = __importDefault(require("../../../users/contracts/models/product"));
const exceljs_1 = __importDefault(require("exceljs"));
async function exportGroupsReport({ columnsPrizes, columnsSupliers, users, }) {
    const workbook = new exceljs_1.default.Workbook();
    const sheet = workbook.addWorksheet('tabela 1');
    sheet.mergeCells('A1', 'N1');
    sheet.getCell('A1').value = 'RELATÓRIO DE ESTOQUE DE USUÁRIO';
    sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    const columnsPrizesLabel = columnsPrizes.map(prize => prize.label);
    const columnsSupliersLabel = columnsSupliers.map(suplie => suplie.label);
    const values = [
        'Operador',
        'Parceria',
        ...columnsPrizesLabel,
        ...columnsSupliersLabel,
    ];
    sheet.getRow(2).values = values;
    const columns = values.map(value => {
        return {
            key: value,
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
            },
            width: 15,
        };
    });
    sheet.columns = columns;
    users.forEach(item => {
        const groupLabels = `${item.groupLabels}`;
        const row = {
            Operador: item.name,
            Parceria: groupLabels,
        };
        columnsPrizes.forEach(value => {
            row[value.label] =
                item.prizes?.find(prize => prize.id === value.id)?.quantity || 0;
        });
        columnsSupliers.forEach(value => {
            row[value.label] =
                item.prizes?.find(suplie => suplie.id === value.id)?.quantity || 0;
        });
        sheet.addRow(row);
    });
    return workbook;
}
exports.default = exportGroupsReport;
