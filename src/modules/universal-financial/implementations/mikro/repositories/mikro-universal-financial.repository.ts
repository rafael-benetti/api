import universalFinancial from '@modules/universal-financial/contracts/entities/universal-financial';
import UniversalFinancialRepository from '@modules/universal-financial/contracts/repositories/universal-financial.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroUniversalFinancial from '../entities/mikro-universal-financial';

class MikroUniversalFinancialRepository
  implements UniversalFinancialRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroUniversalFinancial);

  async find(data: {
    groupId: string;
    date: string;
  }): Promise<universalFinancial> {
    const universalFinancial = await this.repository.find({
      groupId,
      date,
    });
  }
}
