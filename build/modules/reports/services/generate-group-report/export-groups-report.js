"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-duplicates */
const format_1 = __importDefault(require("date-fns/format"));
const locale_1 = require("date-fns/locale");
const exceljs_1 = __importDefault(require("exceljs"));
async function exportGroupsReport({ groupsAnalytics, date, }) {
    const workbook = new exceljs_1.default.Workbook();
    const sheet = workbook.addWorksheet('tabela 1');
    sheet.mergeCells('A1', 'I1');
    sheet.getCell('A1').value = `RELATÓRIO POR MÁQUINAS (${format_1.default(date.startDate, "dd 'de' MMMM", {
        locale: locale_1.ptBR,
    })} - ${format_1.default(date.endDate, "dd 'de' MMMM", {
        locale: locale_1.ptBR,
    })})`;
    sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(2).values = [
        'Nome',
        'Máquinas',
        'Faturamento',
        'Prêmios adquiridos',
        'Investimento em prêmios',
        'Investimento em suprimentos',
        'Aluguel',
        'Remoto',
        'Balanço',
    ];
    sheet.columns = [
        {
            key: 'Nome',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
            },
            width: 15,
        },
        {
            key: 'Máquinas',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
            },
            width: 15,
        },
        {
            key: 'Faturamento',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
                numFmt: 'R$#,##0.00',
            },
            width: 15,
        },
        {
            key: 'Prêmios adquiridos',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
            },
            width: 15,
        },
        {
            key: 'Investimento em prêmios',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
                numFmt: 'R$#,##0.00',
            },
            width: 15,
        },
        {
            key: 'Investimento em suprimentos',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
                numFmt: 'R$#,##0.00',
            },
            width: 15,
        },
        {
            key: 'Aluguel',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
                numFmt: 'R$#,##0.00',
            },
            width: 15,
        },
        {
            key: 'Remoto',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
                numFmt: 'R$#,##0.00',
            },
            width: 15,
        },
        {
            key: 'Balanço',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
                numFmt: 'R$#,##0.00',
            },
            width: 15,
        },
    ];
    groupsAnalytics.forEach(item => {
        sheet.addRow({
            Nome: item.groupLabel,
            Máquinas: item.numberOfMachines,
            Faturamento: item.income,
            'Prêmios adquiridos': item.prizePurchaseAmount,
            'Investimento em prêmios': item.prizePurchaseCost,
            'Investimento em suprimentos': item.maintenance,
            Aluguel: item.rent,
            Remoto: item.remoteCreditCost,
            Balanço: item.balance,
        });
    });
    return workbook;
}
exports.default = exportGroupsReport;
