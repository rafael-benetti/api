"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-duplicates */
const address_1 = __importDefault(require("../../../points-of-sale/contracts/models/address"));
const format_1 = __importDefault(require("date-fns/format"));
const locale_1 = require("date-fns/locale");
const exceljs_1 = __importDefault(require("exceljs"));
async function exportPointsOfSaleReport({ date, pointsOfSaleAnalytics, }) {
    const workbook = new exceljs_1.default.Workbook();
    const sheet = workbook.addWorksheet('tabela 1');
    sheet.mergeCells('A1', 'N1');
    sheet.getCell('A1').value = `RELATÓRIO POR PONTO DE VENDA (${format_1.default(date.startDate, "dd 'de' MMMM", {
        locale: locale_1.ptBR,
    })} - ${format_1.default(date.endDate, "dd 'de' MMMM", {
        locale: locale_1.ptBR,
    })})`;
    sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(2).values = [
        'PDV',
        'Parceria',
        'Localização',
        'Máquina',
        'Categoria',
        'Faturamento',
        'Remoto',
        'Prêmios',
        'Jogadas',
        'Valor da jogada',
        'Jogadas por prêmio',
        'Meta R$/prêmio',
        'Meta R$/mês',
        'Média por dia',
    ];
    sheet.columns = [
        {
            key: 'PDV',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
            },
            width: 15,
        },
        {
            key: 'Parceria',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
            },
            width: 15,
        },
        {
            key: 'Localização',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
            },
            width: 15,
        },
        {
            key: 'Máquina',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
            },
            width: 15,
        },
        {
            key: 'Categoria',
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
            key: 'Remoto',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
                numFmt: 'R$#,##0.00',
            },
            width: 15,
        },
        {
            key: 'Prêmios',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
            },
            width: 15,
        },
        {
            key: 'Jogadas',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
            },
            width: 15,
        },
        {
            key: 'Valor da jogada',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
                numFmt: 'R$#,##0.00',
            },
            width: 15,
        },
        {
            key: 'Jogadas por prêmio',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
            },
            width: 20,
        },
        {
            key: 'Meta R$/prêmio',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
                numFmt: 'R$#,##0.00',
            },
            width: 15,
        },
        {
            key: 'Meta R$/mês',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
                numFmt: 'R$#,##0.00',
            },
            width: 15,
        },
        {
            key: 'Média por dia',
            style: {
                alignment: { horizontal: 'center', vertical: 'middle' },
                numFmt: 'R$#,##0.00',
            },
            width: 15,
        },
    ];
    pointsOfSaleAnalytics.forEach(item => {
        item.machineAnalytics.forEach(machineAnalytic => {
            sheet.addRow({
                PDV: item.label,
                Parceria: item.groupLabel,
                Localização: `${item.address.city}/${item.address.state}`,
                Máquina: machineAnalytic.serialNumber,
                Categoria: machineAnalytic.category,
                Faturamento: machineAnalytic.income,
                Remoto: machineAnalytic.remoteCreditAmount,
                Prêmios: machineAnalytic.prizes,
                Jogadas: machineAnalytic.numberOfPlays,
                'Valor da jogada': machineAnalytic.gameValue,
                'Jogadas por prêmio': machineAnalytic.playsPerPrize,
                'Meta R$/prêmio': machineAnalytic.incomePerPrizeGoal,
                'Meta R$/mês': machineAnalytic.incomePerMonthGoal,
                'Média por dia': machineAnalytic.averagePerDay,
            });
        });
    });
    return workbook;
}
exports.default = exportPointsOfSaleReport;
