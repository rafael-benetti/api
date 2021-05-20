import UniversalFinancial from '../entities/universal-financial';

export default interface UniversalFinancialRepository {
  find(data: {
    groupId: string | string[];
    date?: { start: Date; end: Date };
  }): Promise<UniversalFinancial[]>;
}
