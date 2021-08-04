/* eslint-disable import/no-duplicates */

import PointOfSale from '@modules/points-of-sale/contracts/models/point-of-sale';
import { addHours, format, subDays, subHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ExcelJS from 'exceljs';

interface Request {
  serialNumber: string;
  initialDate: Date;
  finalDate: Date;
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

export default async function exportCollectionsReport({
  collectionsAnalytics,
  pointOfSale,
  date,
}: {
  collectionsAnalytics: Request[];
  pointOfSale: PointOfSale;
  date: {
    startDate: Date;
    endDate: Date;
  };
}): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet('tabela 1');

  sheet.mergeCells('A7', 'Q7');
  sheet.getCell('A7').value = `RELATÓRIO DE COLETAS`;

  sheet.getCell('A7').alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.getCell('A2').value = `Ponto de venda:`;
  sheet.getCell('A3').value = `Local:`;
  sheet.getCell('A4').value = `Período:`;
  sheet.getCell('A5').value = `Aluguel:`;

  sheet.mergeCells('B2', 'D2');
  sheet.mergeCells('B3', 'D3');
  sheet.mergeCells('B4', 'D4');
  sheet.mergeCells('B5', 'D5');

  sheet.getCell('B2').value = `${pointOfSale.label}`;

  sheet.getCell('B3').value = `${
    (pointOfSale.address.street,
    pointOfSale.address.neighborhood,
    pointOfSale.address.city)
  }-${pointOfSale.address.state}`;
  sheet.getCell('B4').value = `${format(
    addHours(date.startDate, 3),
    "dd 'de' MMMM",
    {
      locale: ptBR,
    },
  )} - ${format(subDays(date.endDate, 1), "dd 'de' MMMM", {
    locale: ptBR,
  })}`;
  sheet.getCell('B5').value = pointOfSale.isPercentage
    ? `${pointOfSale.rent} %`
    : pointOfSale.rent;

  sheet.getRow(8).values = [
    'Número de série',
    'Data Inicial',
    'Data Final',
    'Qntd. de Dias',
    'Inicial Mecânico Entrada',
    'Final Mecânico Entrada',
    'Diferença Mecânico Entrada',
    'Inicial Digital Entrada',
    'Final Digital Entrada',
    'Diferença Digital Entrada',
    'Recolhido',
    'Inicial Mecânico Saída',
    'Final Mecânico Saída',
    'Diferença Mecânico Saída',
    'Inicial Digital Saída',
    'Final Digital Saída',
    'Diferença Digital Saída',
  ];

  sheet.columns = [
    {
      key: 'Número de série',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Data Inicial',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Data Final',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Qntd. de Dias',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Inicial Mecânico Entrada',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Final Mecânico Entrada',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Diferença Mecânico Entrada',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Inicial Digital Entrada',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Final Digital Entrada',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Diferença Digital Entrada',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Recolhido',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
        numFmt: 'R$#,##0.00',
      },
      width: 15,
    },
    {
      key: 'Inicial Mecânico Saída',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Final Mecânico Saída',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Diferença Mecânico Saída',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Inicial Digital Saída',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Final Digital Saída',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
    {
      key: 'Diferença Digital Saída',
      style: {
        alignment: { horizontal: 'center', vertical: 'middle' },
      },
      width: 15,
    },
  ];

  collectionsAnalytics.forEach(item => {
    sheet.addRow({
      'Número de série': item.serialNumber,
      'Data Inicial': subHours(item.initialDate, 3),
      'Data Final': subHours(item.finalDate, 3),
      'Qntd. de Dias': item.numberOfDays,
      'Inicial Mecânico Entrada': item.initialMechanicalCountIn,
      'Final Mecânico Entrada': item.finalMechanicalCountIn,
      'Diferença Mecânico Entrada': item.mechanicalDiffenceIn,
      'Inicial Digital Entrada': item.initialDigitalCountIn,
      'Final Digital Entrada': item.finalDigitalCountIn,
      'Diferença Digital Entrada': item.digitalDiffenceIn,
      Recolhido: item.userCount,
      'Inicial Mecânico Saída': item.initialMechanicalCountOut,
      'Final Mecânico Saída': item.finalMechanicalCountOut,
      'Diferença Mecânico Saída': item.digitalDiffenceOut,
      'Inicial Digital Saída': item.initialMechanicalCountOut,
      'Final Digital Saída': item.finalMechanicalCountOut,
      'Diferença Digital Saída': item.digitalDiffenceOut,
    });
  });

  return workbook;
}
