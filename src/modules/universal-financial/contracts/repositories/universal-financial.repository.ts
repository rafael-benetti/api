import UniversalFinancial from '../entities/universal-financial';

export default interface UniversalFinancialRepository {
  find(data: { groupId: string; date: string }): Promise<UniversalFinancial>;
}
