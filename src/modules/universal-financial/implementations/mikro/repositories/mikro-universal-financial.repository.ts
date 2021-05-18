import logger from '@config/logger';
import UniversalFinancial from '@modules/universal-financial/contracts/entities/universal-financial';
import UniversalFinancialRepository from '@modules/universal-financial/contracts/repositories/universal-financial.repository';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { container } from 'tsyringe';
import MikroUniversalFinancial from '../entities/mikro-universal-financial';
import UniversalFinancialMapper from '../mappers/universal-financial.mapper';

class MikroUniversalFinancialRepository
  implements UniversalFinancialRepository {
  private repository = container
    .resolve<MikroOrmProvider>('OrmProvider')
    .entityManager.getRepository(MikroUniversalFinancial);

  async find({
    date,
    groupId,
  }: {
    groupId: string;
    date?: { start: Date; end: Date };
  }): Promise<UniversalFinancial[]> {
    const universalFinancial = await this.repository.find({
      groupId,
      ...(date?.start && {
        date: {
          $gte: date.start,
        },
      }),
      ...(date?.end && {
        date: {
          $lte: date.end,
        },
      }),
    });

    return universalFinancial.map(item =>
      UniversalFinancialMapper.toEntity(item),
    );
  }
}

export default MikroUniversalFinancialRepository;
