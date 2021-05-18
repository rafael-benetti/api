export default interface CreateUniversalFinalcialDto {
  id: string;

  date: Date;

  groupId: string;

  cashIncome: number;

  coinIncome: number;

  creditCardIncome: number;

  givenPrizes: number;

  others: number;

  ownerId: number;

  remoteCredit: number;
}
