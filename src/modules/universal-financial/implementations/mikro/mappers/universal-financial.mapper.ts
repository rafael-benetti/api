import UniversalFinancial from '@modules/universal-financial/contracts/entities/universal-financial';
import MikroUniversalFinancial from '../entities/mikro-universal-financial';

abstract class UniversalFinancialMapper {
  static toEntity(data: MikroUniversalFinancial): UniversalFinancial {
    const universalFinancial = new UniversalFinancial();
    Object.assign(universalFinancial, data);
    return universalFinancial;
  }

  static toMikroEntity(data: UniversalFinancial): MikroUniversalFinancial {
    const universalFinancial = new MikroUniversalFinancial();
    Object.assign(universalFinancial, data);
    return universalFinancial;
  }
}

export default UniversalFinancialMapper;
