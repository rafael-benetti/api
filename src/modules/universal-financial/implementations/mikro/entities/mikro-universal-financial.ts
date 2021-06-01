import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateUniversalFinalcialDto from '@modules/universal-financial/contracts/dtos/create-universal-financial.dto';
import UniversalFinancial from '@modules/universal-financial/contracts/entities/universal-financial';

@Entity({ collection: 'universal-financial' })
class MikroUniversalFinancial implements UniversalFinancial {
  @PrimaryKey()
  id: string;

  @Property()
  date: Date;

  @Property()
  groupId: string;

  @Property()
  cashIncome: number;

  @Property()
  coinIncome: number;

  @Property()
  creditCardIncome: number;

  @Property()
  givenPrizes: number;

  @Property()
  others: number;

  @Property()
  ownerId: number;

  @Property()
  remoteCredit: number;

  constructor(data?: CreateUniversalFinalcialDto) {
    if (data) {
      this.id = data.id;
      this.cashIncome = data.cashIncome;
      this.coinIncome = data.coinIncome;
      this.creditCardIncome = data.creditCardIncome;
      this.date = data.date;
      this.givenPrizes = data.givenPrizes;
      this.groupId = data.groupId;
      this.others = data.others;
      this.ownerId = data.ownerId;
      this.remoteCredit = data.remoteCredit;
    }
  }
}

export default MikroUniversalFinancial;
