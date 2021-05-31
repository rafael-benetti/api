/* eslint-disable import/no-duplicates */
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';

import ExcelJS from 'exceljs';

interface Request {
  initialMechanicalCountIn: number;
  finalMechanicalCountIn: number;
  mechanicalDiffenceIn: number;
  initialMechanicalCountOut: number;
  finalMechanicalCountOut: number;
  mechanicalDiffenceOut: number;
  initialDigitalCountIn: number;
  finalDigitalCountIn: number;
  digitalDiffenceIn: number;
  initialDigitalCountOut: number;
  finalDigitalCountOut: number;
  digitalDiffenceOut: number;
  numberOfDays: number;
  userCount: number;
}

export default async function exportCollectionsReport(
  collectionsAnalytics: Request[],
): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet('tabela 1');

  sheet.mergeCells('A1', 'N1'); // TODO:
  sheet.getCell('A1').value = `RELATÓRIO DE COLETAS`;

  sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.getRow(2).values = [
    'Número de série',
    'Inicial',
    'Final',
    'Dias',
    '',
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
      key: 'Income',
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
      Income: item.income,
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
