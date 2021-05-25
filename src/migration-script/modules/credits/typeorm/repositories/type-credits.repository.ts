// eslint-disable-next-line import/no-extraneous-dependencies
import { getRepository, Repository } from 'typeorm';
import TypeCredit from '../entities/type-credit';

class TypeCreditsRepository {
  private ormRepository: Repository<TypeCredit>;

  constructor() {
    this.ormRepository = getRepository(TypeCredit);
  }

  public async find(): Promise<TypeCredit[]> {
    const credits = await this.ormRepository.find();
    return credits;
  }
}

export default TypeCreditsRepository;
