import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import UniversalFinancial from '@modules/universal-financial/contracts/entities/universal-financial';

@Entity()
class MikroUniversalFinancial implements UniversalFinancial {
  @PrimaryKey()
  id: string;

  @Property()
  date: string;

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
}

export default MikroUniversalFinancial;
