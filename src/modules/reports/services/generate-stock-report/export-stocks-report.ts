/* eslint-disable import/no-duplicates */
import logger from '@config/logger';
import Product from '@modules/users/contracts/models/product';

import ExcelJS, { Column } from 'exceljs';

interface Request {
  columnsSupliers: { id: string; label: string }[];
  columnsPrizes: { id: string; label: string }[];
  users: {
    id: string;
    name: string;
    prizes: Product[] | undefined;
    supplies: Product[] | undefined;
    groupLabels: (string | undefined)[] | undefined;
  }[];
}

export default async function exportGroupsReport({
  columnsPrizes,
  columnsSupliers,
  users,
}: Request): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet('tabela 1');

  sheet.mergeCells('A1', 'N1');
  sheet.getCell('A1').value = 'RELATÓRIO DE ESTOQUE DE USUÁRIO';

  sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

  const columnsPrizesLabel = columnsPrizes.map(prize => prize.label);
  const columnsSupliersLabel = columnsSupliers.map(suplie => suplie.label);

  const values = [
    'Usuário',
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
  }) as Partial<Column>[];

  sheet.columns = columns;

  users.forEach(item => {
    const groupLabels = `${item.groupLabels}`;

    const row: { [key: string]: unknown } = {
      Usuário: item.name,
      Parceria: groupLabels,
    };

    logger.info(sheet.columns);
    // logger.info('item.prizes');
    // logger.info(item.prizes);

    columnsPrizes.forEach(value => {
      row[value.label] =
        item.prizes?.find(prize => prize.id === value.id)?.quantity || 0;
    });

    columnsSupliers.forEach(value => {
      row[value.label] =
        item.prizes?.find(suplie => suplie.label === value.id)?.quantity || 0;
    });

    sheet.addRow(row);
  });

  return workbook;
}
