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
export default async function exportMachineReport({
  machineAnalytics,
}: {
  date: {
    startDate: Date;
    endDate: Date;
  };
  machineAnalytics: Request[];
}): Promise<void> {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet('tabela 1', {
    headerFooter: { firstHeader: 'Hello Exceljs', firstFooter: 'Hello World' },
  });

  sheet.columns = [
    { header: 'Máquina', key: 'serialNumber', width: 10 },
    { header: 'Parceria', key: 'groupLabel', width: 10 },
    { header: 'Categoria', key: 'categoria', width: 10 },
    { header: 'Localização', key: 'location', width: 10 },
    { header: 'Faturamento', key: 'income', width: 10 },
    { header: 'Remoto', key: 'remoteCreditAmount', width: 10 },
    { header: 'Prêmios', key: 'prizes', width: 10 },
    { header: 'Jogadas', key: 'numberOfPlays', width: 10 },
    { header: 'Valor da jogada', key: 'gameValue', width: 15 },
    { header: 'Jogadas por prêmio', key: 'playsPerPrize', width: 15 },
    { header: 'Meta R$/prêmio', key: 'incomePerPrizeGoal', width: 15 },
    { header: 'Meta R$/mês', key: 'incomePerMonthGoal', width: 15 },
    { header: 'Média por dia', key: 'averagePerDay', width: 15 },
  ];

  for (let i = 0; i < machineAnalytics.length; i += 1) {
    sheet.addRow({
      serialNumber: machineAnalytics[i].serialNumber,
    });
  }

  await workbook.xlsx.writeFile('./tmp/test.xlsx');
}
