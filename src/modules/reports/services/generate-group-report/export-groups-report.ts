/* eslint-disable import/no-duplicates */
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';

import ExcelJS from 'exceljs';

interface Request {
  groupLabel: string;
  numberOfMachines: number;
  income: number;
  prizePurchaseAmount: number;
  prizePurchaseCost: number;
  maintenance: number;
  rent: number;
  remoteCreditCost: number;
  balance: number;
}

export default async function exportGroupsReport({
  groupsAnalytics,
  date,
}: {
  date: {
    startDate: Date;
    endDate: Date;
  };
  groupsAnalytics: Request[];
}): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet('tabela 1');

  sheet.mergeCells('A1', 'I1');
  sheet.getCell('A1').value = `RELATÓRIO POR MÁQUINAS (${format(
    date.startDate,
    "dd 'de' MMMM",
    {
      locale: ptBR,
    },
  )} - ${format(date.endDate, "dd 'de' MMMM", {
    locale: ptBR,
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
