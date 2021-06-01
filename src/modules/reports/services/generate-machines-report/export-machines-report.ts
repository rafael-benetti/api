/* eslint-disable import/no-duplicates */
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';

import ExcelJS from 'exceljs';

interface Request {
  groupLabel: string;
  serialNumber: string;
  location: string | undefined;
  category: string;
  income: number | undefined;
  prizes: number | undefined;
  remoteCreditAmount: number | undefined;
  numberOfPlays: number | undefined;
  gameValue: number;
  playsPerPrize: number;
  incomePerPrizeGoal: number | undefined;
  incomePerMonthGoal: number | undefined;
  averagePerDay: number;
}
export default async function exportMachinesReport({
  machineAnalytics,
  date,
}: {
  date: {
    startDate: Date;
    endDate: Date;
  };
  machineAnalytics: Request[];
}): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet('tabela 1');

  sheet.mergeCells('A1', 'M1');
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
    'Máquina',
    'Parceria',
    'Categoria',
    'Localização',
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
      key: 'Máquina',
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
      key: 'Categoria',
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

  machineAnalytics.forEach(item => {
    sheet.addRow({
      Máquina: item.serialNumber,
      Parceria: item.groupLabel,
      Categoria: item.category,
      Localização: item.location,
      Faturamento: item.income,
      Remoto: item.remoteCreditAmount,
      Prêmios: item.prizes,
      Jogadas: item.gameValue,
      'Valor da jogada': item.numberOfPlays,
      'Jogadas por prêmio': item.playsPerPrize,
      'Meta R$/prêmio': item.incomePerPrizeGoal,
      'Meta R$/mês': item.incomePerMonthGoal,
      'Média por dia': item.averagePerDay,
    });
  });

  return workbook;
}
