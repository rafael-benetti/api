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

export default function exportMachineReport(data: Request): void {}
