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
  }) as Partial<Column>[];

  sheet.columns = columns;

  logger.info(sheet.columnCount);
  logger.info(sheet.columns);

  users.forEach(item => {
    const groupLabels = `${item.groupLabels}`;

    const row: { [key: string]: unknown } = {
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
